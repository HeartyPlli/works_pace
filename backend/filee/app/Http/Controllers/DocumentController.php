<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DocumentController
{
    public function index()
    {
        return DB::table('documents')->select('id', 'title', 'type', 'document_date', 'attachment_name')
            ->orderByDesc('document_date')->orderByDesc('id')->get();
    }

    public function show(int $id)
    {
        $document = DB::table('documents')->find($id);
        abort_unless($document, 404);
        unset($document->attachment_path);

        return $document;
    }

    public function save(Request $request, ?int $id = null)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:minutes,narrative,other',
            'document_date' => 'required|date_format:Y-m-d',
            'body' => 'nullable|string|max:100000',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,odt,txt,rtf,xls,xlsx,ppt,pptx,csv,png,jpg,jpeg|max:10240',
            'remove_attachment' => 'sometimes|boolean',
        ]);
        unset($data['attachment'], $data['remove_attachment']);
        $file = $request->file('attachment');
        $newPath = null;
        $oldPath = null;

        try {
            $id = DB::transaction(function () use ($request, $id, $data, $file, &$oldPath, &$newPath) {
                $query = DB::table('documents')->where('id', $id);
                $existing = $id === null ? null : $query->lockForUpdate()->first();
                abort_if($id !== null && ! $existing, 404);
                $remove = $request->boolean('remove_attachment');

                if (empty(trim($data['body'] ?? '')) && ! $file && ($remove || ! $existing?->attachment_path)) {
                    throw ValidationException::withMessages(['body' => 'Write some content or attach a file.']);
                }

                if ($file || $remove) {
                    $oldPath = $existing?->attachment_path;
                    $newPath = $file ? $file->store('council-documents', 'local') : null;
                    abort_if($newPath === false, 500, 'Could not save the attachment.');
                    $data['attachment_path'] = $newPath;
                    $data['attachment_name'] = $file
                        ? mb_substr(preg_replace('/[\p{Cc}\/\\\\]/u', '_', $file->getClientOriginalName()), 0, 255)
                        : null;
                }
                $data['updated_at'] = now();

                if ($id === null) {
                    return DB::table('documents')->insertGetId($data + ['created_at' => now()]);
                }

                $query->update($data);

                return $id;
            });
        } catch (\Throwable $exception) {
            if ($newPath) {
                Storage::disk('local')->delete($newPath);
            }
            throw $exception;
        }

        if ($oldPath) {
            Storage::disk('local')->delete($oldPath);
        }

        return $this->show($id);
    }

    public function download(int $id)
    {
        $document = DB::table('documents')->find($id);
        abort_unless($document?->attachment_path && Storage::disk('local')->exists($document->attachment_path), 404);

        return Storage::disk('local')->download($document->attachment_path, $document->attachment_name, [
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, no-store',
        ]);
    }

    public function destroy(int $id)
    {
        $path = DB::transaction(function () use ($id) {
            $query = DB::table('documents')->where('id', $id);
            $document = $query->lockForUpdate()->first();
            abort_unless($document, 404);
            $query->delete();

            return $document->attachment_path;
        });
        if ($path) {
            Storage::disk('local')->delete($path);
        }

        return response()->noContent();
    }
}

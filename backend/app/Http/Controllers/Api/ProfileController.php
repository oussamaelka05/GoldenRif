<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'whatsapp'              => 'nullable|string|max:20',
            'password'              => 'nullable|string|min:6|confirmed',
            'password_confirmation' => 'nullable|string',
        ]);

        $user->name     = $data['name'];
        $user->email    = $data['email'];
        $user->whatsapp = $data['whatsapp'] ?? null;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return response()->json($user->fresh());
    }
}

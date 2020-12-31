<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request): array
    {
        $type = $this->getType(true);
        $emails = $this->getMainAndSecondEmails();
        return [
                'id' => $this->id,
                'phone' => $this->phone,
                'cart' => new CartResource($this->cart, false),
                key($type) => $type[key($type)],
                'email' => $emails['email'],
                'emailAdditional' => $emails['emailAdditional'],
                'createdAt' => strtotime($this->created_at),
                'updatedAt' => strtotime($this->updated_at),
        ];
    }
}

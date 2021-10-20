<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function JsonExport($code, $msg, $data = null, $optinal = null)
    {
        try {
            $callback = [
                'code' => $code,
                'msg' => $msg
            ];
            if ($data != null) {
                $callback['data'] = $data;
            } else if (is_array($data) && count($data) == 0) {
                $callback['data'] = array();
            } else {
                $callback['data'] = (object)[];
            }
            if ($optinal != null && is_array($optinal)) {
                if (count($optinal) > 1) {
                    for ($i = 0; $i < count($optinal); $i++) {
                        $callback[$optinal[$i]['name']] = $optinal[$i]['data'];
                    }
                } else {
                    $callback[$optinal[0]['name']] = $optinal[0]['data'];
                }
            }
            return response()->json($callback, 200, []);
        } catch (\Exception $e) {
            return response()->json(['code' => 500, 'msg' => 'Internal Server Error'], 200, []);
        }
    }
}

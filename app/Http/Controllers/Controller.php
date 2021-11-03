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

    /**
     * get IP of client
     * @return string $clienip
     */
    public function ClientIP(){
        try {
            $clientIP = $_SERVER['HTTP_CLIENT_IP']
                ?? $_SERVER["HTTP_CF_CONNECTING_IP"]
                ?? $_SERVER['HTTP_X_FORWARDED']
                ?? $_SERVER['HTTP_X_FORWARDED_FOR']
                ?? $_SERVER['HTTP_FORWARDED']
                ?? $_SERVER['HTTP_FORWARDED_FOR']
                ?? $_SERVER['REMOTE_ADDR']
                ?? '0.0.0.0';
            return $clientIP;
        } catch (\Exception $e){
            return '0.0.0.0';
        }
    }
}

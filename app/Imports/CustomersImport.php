<?php
namespace App\Imports;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use App\Models;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Events\AfterImport;
use DB;

class CustomersImport implements ToCollection, WithStartRow
{
    /**
     * @param array $row
     *
     */
    private $row_error = [];

    public function collection(Collection $rows)
    {
        info('---CUSTOMER START---');
        $result = $this->deleteRowEmpty($rows);
        $data = []; 
        foreach($rows as $key => $val){
            array_push($data, [
                'customer_name' => $val[0],
                'email' => $val[1],
                'tel_num' => $val[2],
                'address' => $val[3],
                'is_active' => 1
            ]);
        }

        if(count($data) > 2000){
            foreach(array_chunk($data, 10) as $key => $val){
                Models\MstCustomer::insert($val);
            }
        } else {
            Models\MstCustomer::insert($data);
        }
        info('---CUSTOMER END---');
    }

    public function startRow(): int
    {
        return 2;
    }

    public function getErrorRow()
    {
        return $this->row_error;
    }

    public function deleteRowEmpty($rows)
    {
        foreach($rows as $key => $row)
        {
            $rules = [
                '0' => 'required|max:255|min:5',
                '1' => 'required|max:255|email',
                '2' => 'required|max:14|regex:/^([0-9\s\-\+\(\)]*)$/',
                '3' => 'required|max:255',
            ];
            $validator = Validator::make($row->toArray(), $rules);
            if($validator->fails()){
                array_push($this->row_error, $key);
                $rows->forget($key);
            }
        }
    }

    public static function afterImport(AfterImport $event)
    {
        //
        return $this->JsonExport(500, 'Vui lòng liên hệ quản trị viên để được hỗ trợ!');
    }

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
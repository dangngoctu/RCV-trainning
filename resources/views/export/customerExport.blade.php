<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Export</title>
</head>
<body>
    <table>
        <thead>
        <tr>
            <th>Tên Khách hàng</th>
            <th>Email</th>
            <th>TelNum</th>
            <th>Địa chỉ</th>
        </tr>
        </thead>
        <tbody>
        @foreach($data as $key => $val)
            <tr>
                <td>{{ $val->customer_name }}</td>
                <td>{{ $val->email }}</td>
                <td>{{ $val->tel_num }}</td>
                <td>{{ $val->address }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</body>
</html>
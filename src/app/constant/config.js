import * as Yup from 'yup';

export const PAGE_SIZE_LIST = 10;

export const PAGE_SIZE_IMAGE = 12;

export const messageToastType_const = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'success'
};

export const roleName_const = [
  'Giám đốc',
  'Quản lý',
  'Kế toán',
  'Nhân viên Sale',
  'Đại lý',
  'Khách hàng'
];

export const userShape_const = {
  email: Yup.string()
    .email('Email chưa đúng định dạng')
    .max(255)
    .required('Bạn cần nhập Email'),
  full_name: Yup.string()
    .min(2, 'Tên quá ngắn')
    .max(50, 'Tên quá dài')
    .required('Bạn cần nhập đầy đủ họ tên'),
  phone: Yup.string()
    .matches(new RegExp('^[0-9-+]{9,11}$'), 'Số điện thoại phải đúng định dạng')
    .required('Bạn cần nhập số điện thoại'),
  password: Yup.string()
    .min(4, 'Quá ngắn')
    .max(20, 'Quá dài')
    .required('Bạn cần nhập mật khẩu'),
  address: Yup.string()
    .max(100, 'Quá dài')
    .required('Bạn cần điền địa chỉ')
  // dob: Yup.date().required('Bạn cần chọn ngày sinh')
};

export const DRAFT_USER = { id: 3, value: 'Bản Nháp' };

export const STATUS_API = {
  PENDING: 0,
  SUCCESS: 1,
  ERROR: 2,
  LOADING: 3
};

export const DEVICE_STATUS_VALUE = [
  { id: 1, title: 'Lưu kho' },
  { id: 2, title: 'Bảo hành' }
];

export const DEVICE_STATUS = {
  STORAGE: 1,
  GUARANTEE: 2,
  INACTIVE: 'inactive',
  ACTIVE: 'active'
};
export const AGENCY_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active'
};

export const STORE_STATUS = {
  IN: 'in',
  SELL: 'sell'
};

export const ACTION_TABLE = {
  CREATE: 'create',
  EDIT: 'edit',
  PREVIEW: 'preview',
  DELETE: 'delete'
};

export const MEDIA_VIEW_TYPE = {
  IMAGES: 0,
  VIDEOS: 1
};
export const HTTP_GETTYPE = {
  ALL: 0,
  ALL_PAGINATION: 1,
  DETAIL: 2
};
export const TIMEOUT_DEFAULT = 5000;
export const MSG_TIMEOUT_REQUEST = 'Server phản hồi quá lâu , vui lòng thử lại';
export const CREATE_DEVICE_STEP = {
  ADD_INFO_DEVICE: 1,
  ADD_INFO_VEHICLE: 2
};

export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  NOT_ACTIVE: 'not_active'
};
export const VALIDATE = {
  PHONE: /^((84|0)[3|5|7|8|9])+([0-9]{8})$/,
  PEOPLE_ID: /^(((0[1-9]|3[0-8])[0-9]{7})|(([1-2][0-9]|3[0-8])[0-9]{7})|([0-9]{12}))$/
};

export const CAR_STATUS = [
  {
    value: 'moving',
    label: 'Di chuyển',
    icon: 'car_moving',
    info: 'Phương tiện đang di chuyển'
  },
  {
    value: 'stopped',
    label: 'Dừng đỗ',
    icon: 'car_stopped',
    info: 'Phương tiện dừng đỗ hoặc tắt máy'
  },

  {
    value: 'over_speed',
    label: 'Quá tốc độ',
    icon: 'car_out_speed',
    info: 'Phương tiện di chuyển quá tốc độ'
  },
  {
    value: 'lost_gps',
    label: 'Mất GPS',
    icon: 'car_lost_gsm',
    info: 'Phương tiện mất tín hiệu GPS'
  },
  {
    value: 'lost_gms',
    label: 'Mất GSM',
    icon: 'car_lost_gps',
    info: 'Phương tiện mất tín hiệu liên lạc (4G/GPRS)'
  }
];

export const INFOR_CAR = [
  {
    icon: 'car',
    label: 'Biển kiểm soát',
    dataKey: 'license_plate',
    exampleValue: '30H99888'
  },
  // {
  //   icon: 'pin',
  //   label: 'Địa chỉ',
  //   dataKey: '',
  //   exampleValue: '7 Hồ Thiền Quang, Nguyễn Du, Hai Bà Trưng, Hà Nội'
  // },
  {
    icon: 'clock',
    label: 'Thời gian',
    dataKey: 'created_at',
    exampleValue: '20:45 30/04/2021'
  },
  {
    icon: 'speedometer2',
    label: 'Vận tốc',
    dataKey: 'speed_gps',
    exampleValue: '0 km/h'
  },
  {
    icon: 'engine',
    label: 'Động cơ',
    dataKey: 'engine_status',
    exampleValue: 'Bật'
  },
  {
    icon: 'direction',
    label: 'Km trong ngày',
    dataKey: 'total_distance',
    exampleValue: '500 km'
  },
  {
    icon: 'parked2',
    label: 'Số lần dừng đỗ',
    dataKey: 'stop_times',
    exampleValue: '40 lần'
  },
  {
    icon: 'parked',
    label: 'Đang đỗ',
    dataKey: 'is_stopping',
    exampleValue: '25 phút'
  },
  {
    icon: 'ac',
    label: 'Điều hoà',
    dataKey: 'air_condition_status',
    exampleValue: 'Tắt'
  },
  {
    icon: 'save',
    label: 'Thẻ nhớ',
    dataKey: '',
    exampleValue: 'Bình thường'
  },
  {
    icon: 'user',
    label: 'Lái xe',
    dataKey: 'driver_name',
    exampleValue: 'Vntech24h'
  },
  {
    icon: 'payments',
    label: 'Bằng lái',
    dataKey: 'driver_license',
    exampleValue: 'B2'
  },
  {
    icon: 'phone',
    label: 'Điện thoại',
    dataKey: '',
    exampleValue: '0989982456'
  },
  {
    icon: 'time2',
    label: 'Thời gian lái xe liên tục',
    dataKey: 'non_stop_driving_time',
    exampleValue: ''
  },
  {
    icon: 'driver',
    label: 'Thời gian lái xe trong ngày',
    dataKey: 'total_drive_time',
    exampleValue: '60 phút'
  },
  {
    icon: 'speedometer3',
    label: 'Quá tốc độ',
    dataKey: 'total_overspeed',
    exampleValue: '0 lần'
  },
  {
    icon: 'dollar',
    label: 'Thông tin phí',
    dataKey: '',
    exampleValue: 'Hạn ngày: 13/07/2023'
  }
];

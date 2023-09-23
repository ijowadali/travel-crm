import { ref } from 'vue';

export function roomRules() {
  return ref({
    hotel_id: {
      required: true,
      message: 'Please Select Hotel',
      trigger: 'blur',
    },
    room_type: {
      required: true,
      message: 'Please Select Room Type',
      trigger: 'blur',
    },
    room_no: {
      required: true,
      message: 'Please Enter Room Number',
      trigger: 'blur',
    },
    floor_no: {
      required: true,
      message: 'Please Enter Floor Number',
      trigger: 'blur',
    },
  });
}

export function roomEditRules() {
  return ref({
    room_type: {
      required: true,
      message: 'Please Select Room Type',
      trigger: 'blur',
    },
    room_no: {
      required: true,
      message: 'Please Enter Room Number',
      trigger: 'blur',
    },
    floor_no: {
      required: true,
      message: 'Please Enter Floor Number',
      trigger: 'blur',
    },
  });
}

import { ref } from 'vue';

export function hotelRules() {
  return ref({
    name: {
      required: true,
      message: 'Please Enter name',
      trigger: 'blur'
    },
    phone_number: {
      required: true,
      message: 'Please Select phone number',
      trigger: 'blur'
    },
    owner: {
      required: true,
      message: 'Please Enter owner name',
      trigger: 'blur'
    },
    owner_phone: {
      required: true,
      message: 'Please Enter owner phone number',
      trigger: 'blur'
    },
    address: {
      required: true,
      message: 'Please Enter street no',
      trigger: 'blur'
    },
    city: {
      required: true,
      message: 'Please Enter city',
      trigger: 'blur'
    },
    state: {
      required: true,
      message: 'Please Enter state',
      trigger: 'blur'
    },
    country: {
      required: true,
      message: 'Please Enter country',
      trigger: 'blur'
    }
  });
}

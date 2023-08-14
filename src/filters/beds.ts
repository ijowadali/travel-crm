import { ref } from 'vue'; // Import necessary Composition API functions
import { getBedsApi } from '@/api/hotel/bed/beds';

export function filterBed() {
  // Define reactive variables using ref
  const beds = ref([]);
  const bedLoading = ref(false);
  const bedsInitialized = ref(false);

  // Define methods using regular JavaScript functions
  async function findBed(query) {
    if (query !== '') {
      bedLoading.value = true;
      const response = await getBedsApi({ name: query, pageSize: 1000 });
      beds.value = response.data;
      bedLoading.value = false;
    } else {
      beds.value = [];
    }
  }

  async function findBedByRoom(roomId, status = 'available') {
    if (!roomId) {
      window['$message'].error('Please Select Room First');
      return;
    }
    if (roomId !== '' || status !== '') {
      bedLoading.value = true;
      const response = await getBedsApi({
        room_id: roomId,
        status: status,
        pageSize: 1000,
      });
      beds.value = response.data;
      bedLoading.value = false;
    } else {
      beds.value = [];
    }
  }

  async function getBeds() {
    bedLoading.value = true;
    beds.value = await getBedsApi({});
    bedLoading.value = false;
  }

  async function getBedsOnFocus() {
    if (!bedsInitialized.value) {
      await getBeds();
      bedsInitialized.value = true;
    }
  }

  // Call the getMerchants method on component mount
  // onMounted(getHotels);

  // Return the variables and methods you want to expose to the template
  return {
    beds,
    bedLoading,
    bedsInitialized,
    findBed,
    getBeds,
    getBedsOnFocus,
    findBedByRoom,
  };
}

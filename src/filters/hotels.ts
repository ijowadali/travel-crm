import { ref } from 'vue'; // Import necessary Composition API functions
import { getHotelsApi } from '@/api/hotel/hotel';
import { isEmpty } from 'lodash';

export function filterHotel() {
  // Define reactive variables using ref
  const hotels = ref([]);
  const hotelLoading = ref(false);
  const hotelsInitialized = ref(false);

  // Define methods using regular JavaScript functions
  async function findHotel(query: string) {
    if (isEmpty(query)) {
      hotels.value = [];
    } else {
      hotelLoading.value = true;
      const response = await getHotelsApi({ name: query, pageSize: 1000 });
      hotels.value = response.data;
      hotelLoading.value = false;
    }
  }

  async function findCityHotel(query: string) {
    if (isEmpty(query)) {
      hotels.value = [];
    } else {
      hotelLoading.value = true;
      const response = await getHotelsApi({ city: query, pageSize: 1000 });
      hotels.value = response.data;
      hotelLoading.value = false;
    }
  }

  async function getHotels() {
    hotelLoading.value = true;
    const response = await getHotelsApi({});
    hotels.value = response.data;
    hotelLoading.value = false;
  }

  async function getHotelsOnFocus() {
    if (!hotelsInitialized.value) {
      await getHotels();
      hotelsInitialized.value = true;
    }
  }

  // Call the getMerchants method on component mount
  // onMounted(getHotels);

  // Return the variables and methods you want to expose to the template
  return {
    hotels,
    hotelLoading,
    hotelsInitialized,
    findHotel,
    getHotels,
    getHotelsOnFocus,
    findCityHotel,
  };
}

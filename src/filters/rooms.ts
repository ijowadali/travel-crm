import { ref } from 'vue'; // Import necessary Composition API functions
import { getRoomsApi } from '@/api/hotel/room/rooms';

export function filterRoom() {
  // Define reactive variables using ref
  const rooms = ref([]);
  const roomLoading = ref(false);
  const roomsInitialized = ref(false);

  // Define methods using regular JavaScript functions
  async function findRoom(query) {
    if (query !== '') {
      roomLoading.value = true;
      const response = await getRoomsApi({ name: query, pageSize: 1000 });
      rooms.value = response.data;
      roomLoading.value = false;
    } else {
      rooms.value = [];
    }
  }

  async function findRoomByHotel(hotelId, roomType, is_active = 1) {
    if (!hotelId) {
      window['$message'].error('Please Select Hotel First');
      return;
    }
    if (hotelId !== '' || roomType !== '') {
      roomLoading.value = true;
      const response = await getRoomsApi({
        hotel_id: hotelId,
        room_type: roomType,
        is_active: is_active,
        pageSize: 1000,
      });
      rooms.value = response.data;
      roomLoading.value = false;
    } else {
      rooms.value = [];
    }
  }

  async function getRooms() {
    roomLoading.value = true;
    rooms.value = await getRoomsApi({});
    roomLoading.value = false;
  }

  async function getRoomsOnFocus() {
    if (!roomsInitialized.value) {
      await getRooms();
      roomsInitialized.value = true;
    }
  }

  // Call the getMerchants method on component mount
  // onMounted(getHotels);

  // Return the variables and methods you want to expose to the template
  return {
    rooms,
    roomLoading,
    roomsInitialized,
    findRoom,
    getRooms,
    getRoomsOnFocus,
    findRoomByHotel,
  };
}

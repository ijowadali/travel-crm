import { ref } from 'vue'; // Import necessary Composition API functions
import { getRecordsApi } from '@src/api/endpoints';

export function usefilterRoom() {
  const rooms = ref([]);
  const roomLoading = ref(false);
  const roomsInitialized = ref(false);

  async function findRoom(query: any) {
    if (query !== '') {
      roomLoading.value = true;
      const response: any = await getRecordsApi('/rooms', { name: query });
      rooms.value = response.data;
      roomLoading.value = false;
    } else {
      rooms.value = [];
    }
  }

  async function findRoomByHotel(hotelId: any, roomType: any, is_active = 1) {
    if (!hotelId) {
      window['$message'].error('Please Select Hotel First');
      return;
    }
    if (hotelId !== '' || roomType !== '') {
      roomLoading.value = true;
      const response: any = await getRecordsApi('/rooms', {
        hotel_id: hotelId,
        room_type: roomType,
        is_active: is_active
      });
      rooms.value = response.data;
      roomLoading.value = false;
    } else {
      rooms.value = [];
    }
  }

  async function getRooms() {
    roomLoading.value = true;
    const response: any = await getRecordsApi('/rooms');
    rooms.value = response.result;
    roomLoading.value = false;
  }

  async function getRoomsOnFocus() {
    if (!roomsInitialized.value) {
      await getRooms();
      roomsInitialized.value = true;
    }
  }

  return {
    rooms,
    roomLoading,
    roomsInitialized,
    findRoom,
    getRooms,
    getRoomsOnFocus,
    findRoomByHotel
  };
}

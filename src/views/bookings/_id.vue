<template>
  <n-card>
    <n-card title="Booking Details" style="margin-bottom: 10px">
      <n-tabs ref="tabRef" v-model:value="tabValue" type="segment">
        <n-tab-pane name="general" tab="General Details">
          <n-form
            ref="generalForm"
            :label-width="80"
            :model="bookingGeneralDetails"
            :rules="rules"
            size="small"
          >
            <n-row gutter="12">
              <n-col :span="6">
                <n-form-item label="Customer Name" path="customer_name">
                  <n-input
                    v-model:value="bookingGeneralDetails.customer_name"
                    placeholder="Enter Customer Name"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="6">
                <n-form-item label="Booking Status" path="booking_status">
                  <n-select
                    v-model:value="bookingGeneralDetails.booking_status"
                    filterable
                    placeholder="Search Status"
                    :options="[
                      { label: 'Draft', value: 'draft' },
                      { label: 'Processing', value: 'processing' },
                      { label: 'Final', value: 'Final' },
                    ]"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="6">
                <n-form-item label="Group No" path="group_no">
                  <n-input-number
                    class="w-full"
                    v-model:value="bookingGeneralDetails.group_no"
                    min="0"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="6">
                <n-form-item label="Group Name" path="group_name">
                  <n-input
                    v-model:value="bookingGeneralDetails.group_name"
                    placeholder="Enter Group Name"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="6">
                <n-form-item label="Category" path="category">
                  <n-select
                    v-model:value="bookingGeneralDetails.category"
                    filterable
                    placeholder="Search Category"
                    :options="[
                      { label: 'Basic', value: 'basic' },
                      { label: 'Individual', value: 'individual' },
                      { label: 'Premium', value: 'premium' },
                      { label: 'VIP', value: 'vip' },
                    ]"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="6">
                <n-form-item label="Approval Date" path="approval_date">
                  <n-date-picker
                    style="width: 100%"
                    v-model:formatted-value="bookingGeneralDetails.approval_date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    clearable
                  />
                </n-form-item>
              </n-col>
              <n-col :span="6">
                <n-form-item label="Expected Departure" path="expected_departure">
                  <n-date-picker
                    style="width: 100%"
                    v-model:formatted-value="bookingGeneralDetails.expected_departure"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    clearable
                  />
                </n-form-item>
              </n-col>
              <n-col :span="6">
                <n-form-item label="Confirmed Ticket" path="confirmed_ticket">
                  <n-switch v-model:value="bookingGeneralDetails.confirmed_ticket" />
                </n-form-item>
              </n-col>
            </n-row>
            <n-space :vertical="true">
              <n-form-item>
                <n-button :loading="loading" type="success" @click="saveGeneralBooking">
                  <template #icon>
                    <n-icon>
                      <SaveArrowRight20Filled />
                    </n-icon>
                  </template>
                  Update Booking
                </n-button>
              </n-form-item>
            </n-space>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="visa" tab="Visa Details">
          <n-form ref="visaForm" :label-width="80" :model="visaDetails" :rules="rules" size="small">
            <n-card title="Visa Details" style="display: flex; width: 100%; margin-bottom: 10px">
              <n-row gutter="12">
                <n-col :span="8">
                  <n-form-item label="IATA" path="iata">
                    <n-select
                      v-model:value="visaDetails.iata"
                      filterable
                      placeholder="Select Option"
                      :options="[
                        { label: 'Basic', value: 'basic' },
                        { label: 'Individual', value: 'individual' },
                        { label: 'Premium', value: 'premium' },
                        { label: 'VIP', value: 'vip' },
                      ]"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="8">
                  <n-form-item label="Visa Company" path="visa_company">
                    <n-input
                      v-model:value="visaDetails.visa_company"
                      placeholder="Enter Visa Company"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="8">
                  <n-form-item label="Visa Status" path="visa_status">
                    <n-select
                      v-model:value="visaDetails.visa_status"
                      filterable
                      placeholder="Select Option"
                      :options="[
                        { label: 'Basic', value: 'basic' },
                        { label: 'Individual', value: 'individual' },
                        { label: 'Premium', value: 'premium' },
                        { label: 'VIP', value: 'vip' },
                      ]"
                    />
                  </n-form-item>
                </n-col>
              </n-row>
            </n-card>
            <n-space :vertical="true">
              <n-form-item>
                <n-button :loading="loading" type="success" @click="saveVisaDetails">
                  <template #icon>
                    <n-icon>
                      <SaveArrowRight20Filled />
                    </n-icon>
                  </template>
                  Update Booking
                </n-button>
              </n-form-item>
            </n-space>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="members" tab="List Members">
          <n-card title="Members Details" class="flex w-full mb-1">
            <n-button @click="addUpdateMember({ hotelDetails: {} })" type="success">
              <n-icon>
                <plus-outlined />
              </n-icon>
              Add Member
            </n-button>
            <n-row gutter="12">
              <n-table v-if="members.length" :striped="true">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Family Name</th>
                    <th>Gender</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in members" :key="index">
                    <td>{{ item.first_name }}</td>
                    <td>{{ item.family_name }}</td>
                    <td>{{ item.gender }}</td>
                    <td>{{ item.title }}</td>
                    <td>
                      <n-button
                        strong
                        secondary
                        circle
                        type="error"
                        @click="members.splice(index, 1)"
                      >
                        <template #icon>
                          <n-icon>
                            <Delete20Filled />
                          </n-icon>
                        </template>
                      </n-button>
                      <n-button
                        strong
                        secondary
                        circle
                        type="success"
                        @click="addUpdateMember(item)"
                      >
                        <template #icon>
                          <n-icon>
                            <NotepadEdit20Filled />
                          </n-icon>
                        </template>
                      </n-button>
                    </td>
                  </tr>
                </tbody>
              </n-table>
            </n-row>
          </n-card>
          <n-button
            type="primary"
            size="large"
            :circle="true"
            style="position: fixed; bottom: 30px; right: 40px"
            @click="addUpdateMember({ hotelDetails: {} })"
          >
            <template #icon>
              <n-icon>
                <plus-outlined />
              </n-icon>
            </template>
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="add_members" tab="Add Members">
          <n-form ref="memberForm" :label-width="80" :model="newMember" :rules="rules" size="small">
            <n-card title="General Details" class="flex w-full mb-1">
              <n-row gutter="12">
                <n-col :span="6">
                  <n-form-item label="First Name" path="first_name">
                    <n-input v-model:value="newMember.first_name" placeholder="Enter First Name" />
                  </n-form-item>
                </n-col>
                <!--                  <n-col :span="8">-->
                <!--                    <n-form-item label="Family Name" path="family_name">-->
                <!--                      <n-input-->
                <!--                        v-model:value="bookingMember.family_name"-->
                <!--                        placeholder="Enter Family Name"-->
                <!--                      />-->
                <!--                    </n-form-item>-->
                <!--                  </n-col>-->
                <n-col :span="6">
                  <n-form-item label="DOB" path="dob">
                    <n-date-picker
                      format="yyyy-MM-dd"
                      class="w-full"
                      v-model:formatted-value="newMember.dob"
                      type="date"
                    />
                  </n-form-item>
                </n-col>
                <!--                  <n-col :span="8">-->
                <!--                    <n-form-item label="Marital Status" path="marital_status">-->
                <!--                      <n-select-->
                <!--                        v-model:value="bookingMember.marital_status"-->
                <!--                        filterable-->
                <!--                        placeholder="Select Option"-->
                <!--                        :options="[-->
                <!--                          { label: 'Single', value: 'single' },-->
                <!--                          { label: 'Married', value: 'married' },-->
                <!--                          { label: 'Divorced', value: 'divorced' },-->
                <!--                          { label: 'Widowed', value: 'widowed' },-->
                <!--                        ]"-->
                <!--                      />-->
                <!--                    </n-form-item>-->
                <!--                  </n-col>-->
                <!--                  <n-col :span="8">-->
                <!--                    <n-form-item label="Title" path="marital_status">-->
                <!--                      <n-input v-model:value="bookingMember.title" placeholder="Enter Title" />-->
                <!--                    </n-form-item>-->
                <!--                  </n-col>-->
                <!--                  <n-col :span="8">-->
                <!--                    <n-form-item label="Education" path="education">-->
                <!--                      <n-select-->
                <!--                        v-model:value="bookingMember.education"-->
                <!--                        filterable-->
                <!--                        placeholder="Select Option"-->
                <!--                        :options="[-->
                <!--                          { label: 'Primary School', value: 'primary school' },-->
                <!--                          { label: 'High School', value: 'high school' },-->
                <!--                          { label: 'College Education', value: 'college education' },-->
                <!--                          { label: 'Higher Education', value: 'higher education' },-->
                <!--                          { label: 'No Education', value: 'no education' },-->
                <!--                        ]"-->
                <!--                      />-->
                <!--                    </n-form-item>-->
                <!--                  </n-col>-->
                <!--                  <n-col :span="8">-->
                <!--                    <n-form-item label="Nationality" path="nationality">-->
                <!--                      <n-input-->
                <!--                        v-model:value="bookingMember.nationality"-->
                <!--                        placeholder="Enter Nationality"-->
                <!--                      />-->
                <!--                    </n-form-item>-->
                <!--                  </n-col>-->
                <n-col :span="6">
                  <n-form-item label="Gender" path="gender">
                    <n-select
                      v-model:value="newMember.gender"
                      filterable
                      placeholder="Select Option"
                      :options="[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                      ]"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Family Head" path="family_head">
                    <n-switch v-model:value="newMember.family_head" />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Passport" path="passport">
                    <n-input v-model:value="newMember.passport" placeholder="Enter Passport" />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Issue Date" path="issue_date">
                    <n-date-picker
                      value-format="yyyy-MM-dd"
                      class="w-full"
                      v-model:formatted-value="newMember.issue_date"
                      type="date"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Expiry Date" path="expiry_date">
                    <n-date-picker
                      value-format="yyyy-MM-dd"
                      class="w-full"
                      v-model:formatted-value="newMember.expiry_date"
                      type="date"
                    />
                  </n-form-item>
                </n-col>
              </n-row>
            </n-card>
            <!--              <n-card title="Relation Details" class="flex w-full mb-1">-->
            <!--                <n-row gutter="12">-->
            <!--                  <n-col :span="12">-->
            <!--                    <n-form-item label="Relation" path="relation">-->
            <!--                      <n-input-->
            <!--                        v-model:value="bookingMember.relation"-->
            <!--                        placeholder="Enter Relation"-->
            <!--                      />-->
            <!--                    </n-form-item>-->
            <!--                  </n-col>-->
            <!--                  <n-col :span="12">-->
            <!--                    <n-form-item label="Mehram Name" path="mehram_name">-->
            <!--                      <n-input-->
            <!--                        v-model:value="bookingMember.mehram_name"-->
            <!--                        placeholder="Enter Mehram Name"-->
            <!--                      />-->
            <!--                    </n-form-item>-->
            <!--                  </n-col>-->
            <!--                </n-row>-->
            <!--              </n-card>-->
            <n-card title="Hotel Details" class="flex w-full mb-1">
              <n-row gutter="12">
                <n-col :span="6">
                  <n-form-item label="Hotel City" path="hotel_city">
                    <n-select
                      v-model:value="hotel_city"
                      filterable
                      tag
                      placeholder="Select Option"
                      @update:value="filterHotels(hotel_city)"
                      :options="[
                        { label: 'Madina', value: 'madina' },
                        { label: 'Makkah', value: 'makkah' },
                      ]"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Hotel" path="hotel_id">
                    <single-hotel-selector
                      v-model:value="newMember.hotelDetails.hotel_id"
                      label-field="name"
                      value-field="id"
                      :tag="false"
                      :options="filteredHotels"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Room Type" path="room_type">
                    <n-select
                      v-model:value="newMember.hotelDetails.room_type"
                      filterable
                      placeholder="Select Option"
                      :options="[
                        { label: 'Double Bed', value: 'double bed' },
                        { label: 'Quad Bed', value: 'quad bed' },
                        { label: 'Quint Bed', value: 'quint bed' },
                        { label: 'Sharing', value: 'sharing' },
                        { label: 'Six Bed', value: 'six bed' },
                        { label: 'Triple Bed', value: 'triple bed' },
                      ]"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Room No" path="room_no">
                    <n-select
                      v-model:value="newMember.hotelDetails.room_no"
                      filterable
                      placeholder="Select Option"
                      :options="hotels_dropdown"
                      label-field="name"
                      value-field="id"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Bed No" path="bed_no">
                    <n-select
                      v-model:value="newMember.hotelDetails.bed_no"
                      filterable
                      placeholder="Select Option"
                      :options="hotels_dropdown"
                      label-field="name"
                      value-field="id"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="Nights" path="nights">
                    <n-input-number
                      class="w-full"
                      v-model:value="newMember.hotelDetails.nights"
                      min="0"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="CheckIn Date" path="checkin_date">
                    <n-date-picker
                      style="width: 100%"
                      v-model:formatted-value="newMember.hotelDetails.checkin_date"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      clearable
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="6">
                  <n-form-item label="CheckOut Date" path="checkout_date">
                    <n-date-picker
                      style="width: 100%"
                      v-model:formatted-value="newMember.hotelDetails.checkout_date"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      clearable
                    />
                  </n-form-item>
                </n-col>
              </n-row>
            </n-card>
            <n-space :vertical="true">
              <n-form-item>
                <n-button :loading="loading" type="success" @click="saveMemberDetails">
                  <template #icon>
                    <n-icon>
                      <SaveArrowRight20Filled />
                    </n-icon>
                  </template>
                  Update Member
                </n-button>
              </n-form-item>
            </n-space>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
    <!--    </n-space>-->
  </n-card>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { SaveArrowRight20Filled, Delete20Filled, NotepadEdit20Filled } from '@vicons/fluent';
  import { getBookingApi, updateBookingApi } from '@/api/booking/booking';
  import { useRoute } from 'vue-router';
  // import { getHotelsApi } from '@/api/hotel/hotel';
  import { PlusOutlined } from '@vicons/antd';
  import { useHotel } from '@/hooks/useHotel';

  const route = useRoute();
  const hotels_dropdown = ref([]);
  const newMember: any = ref({ hotelDetails: {} });
  const hotel_city: any = ref('');
  const members: any = ref([]);
  const tabValue: any = ref('general');
  const bookingGeneralDetails: any = ref({});
  const visaDetails: any = ref({});
  const loading = ref(false);
  const rules = ref({
    company_name: {
      required: true,
      message: 'Please Enter Name',
      trigger: 'blur',
    },
  });
  const { filterHotels, filteredHotels } = useHotel(false);
  onMounted(async () => {
    if (route.params.id) {
      getBookingApi(1).then((result) => {
        bookingGeneralDetails.value = {
          customer_name: result.customer_name,
          booking_status: result.booking_status,
          group_no: result.group_no,
          group_name: result.group_name,
          category: result.category,
          approval_date: result.approval_date,
          expected_departure: result.expected_departure,
          confirmed_ticket: result.confirmed_ticket,
        };
        visaDetails.value = result.visaDetails;
        members.value = result.members;
      });
    }
    // getHotelsApi({ pageSize: 1000 }).then((result: any) => {
    //   hotels_dropdown.value = result.data;
    // });
  });

  function getHotel(city) {
    console.log(city);
  }

  function addUpdateMember(member) {
    tabValue.value = 'add_members';
    newMember.value = member;
  }

  function saveGeneralBooking() {
    loading.value = true;
    updateBookingApi(parseInt(String(route.params.id)), {
      ...bookingGeneralDetails.value,
      type: 'general',
    }).then((result) => {
      window['$message'].success(result.message);
      loading.value = false;
    });
  }

  function saveVisaDetails() {
    loading.value = true;
    updateBookingApi(parseInt(String(route.params.id)), {
      ...visaDetails.value,
      type: 'visa',
    }).then((result) => {
      window['$message'].success(result.message);
      loading.value = false;
    });
  }

  function saveMemberDetails() {
    loading.value = true;
    updateBookingApi(parseInt(String(route.params.id)), {
      ...newMember.value,
      type: 'member',
    }).then((result) => {
      newMember.value = {};
      window['$message'].success(result.message);
      loading.value = false;
    });
  }

  // function saveBooking() {
  //   loading.value = true;
  //   if (route.query.booking_id) {
  //     updateBookingApi(parseInt(String(route.query.booking_id)), { ...formValue.value }).then(
  //       (result) => {
  //         window['$message'].success(result.message);
  //         loading.value = false;
  //       }
  //     );
  //   } else {
  //     createBookingApi({ ...formValue.value }).then((result) => {
  //       window['$message'].success(result.message);
  //       loading.value = false;
  //     });
  //   }
  // }
</script>

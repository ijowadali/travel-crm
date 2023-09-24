<template>
  <n-card>
    <n-card title="Booking Details" style="margin-bottom: 10px">
      <n-tabs ref="tabRef" v-model:value="tabValue" type="card">
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
                <n-form-item label="Booking Status" path="status">
                  <n-select
                    v-model:value="bookingGeneralDetails.status"
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
        <n-tab-pane name="members" tab="List Members">
          <n-card title="Members Details" class="flex w-full mb-1">
            <n-row gutter="12">
              <n-col v-for="member of members" :key="member" :span="6">
                <n-card
                  :title="member.name"
                  :segmented="{
                    content: true,
                    footer: 'soft',
                  }"
                >
                  <template #header-extra>
                    <n-button strong secondary circle type="primary" @click="showModel(member)">
                      <template #icon>
                        <n-icon>
                          <Info16Filled />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button strong secondary circle type="success">
                      <template #icon>
                        <n-icon>
                          <TextBulletListSquareEdit24Regular />
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                  <n-row v-if="member.hotelDetails.length">
                    <n-row
                      v-for="hotel in member.hotelDetails"
                      :key="hotel.id"
                      class="flex justify-between items-center"
                      :span="24"
                    >
                      <span>{{ hotel.city }}</span>
                      <span>
                        <n-button strong secondary circle type="primary">
                          <template #icon>
                            <n-icon>
                              <Info16Filled />
                            </n-icon>
                          </template>
                        </n-button>
                        <n-button strong secondary circle type="success">
                          <template #icon>
                            <n-icon>
                              <TextBulletListSquareEdit24Regular />
                            </n-icon>
                          </template>
                        </n-button>
                      </span>
                    </n-row>
                    <n-button
                      v-if="member.hotelDetails.length < 3"
                      strong
                      secondary
                      round
                      type="success"
                      @click="actionOperation(member.id)"
                    >
                      Assign More Hotel
                    </n-button>
                  </n-row>
                  <n-button
                    v-else
                    strong
                    secondary
                    round
                    type="success"
                    @click="actionOperation(member.id)"
                  >
                    Assign Hotel
                  </n-button>
                </n-card>
              </n-col>
            </n-row>
          </n-card>
        </n-tab-pane>
        <n-tab-pane name="add_members" tab="Add Members">
          <n-form ref="memberForm" :label-width="80" :model="newMember" :rules="rules" size="small">
            <n-card title="General Details" class="flex w-full mb-1">
              <n-row gutter="12">
                <n-col :span="6">
                  <n-form-item label="First Name" path="name">
                    <n-input v-model:value="newMember.name" placeholder="Enter First Name" />
                  </n-form-item>
                </n-col>
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
            <n-card title="Visa Details" style="display: flex; width: 100%; margin-bottom: 10px">
              <n-row gutter="12">
                <n-col :span="8">
                  <n-form-item label="IATA" path="iata">
                    <n-select
                      v-model:value="newMember.iata"
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
                      v-model:value="newMember.visa_company"
                      placeholder="Enter Visa Company"
                    />
                  </n-form-item>
                </n-col>
                <n-col :span="8">
                  <n-form-item label="Visa Status" path="visa_status">
                    <n-select
                      v-model:value="newMember.visa_status"
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
                <n-button :loading="loading" type="success" @click="saveMemberDetails">
                  <template #icon>
                    <n-icon>
                      <SaveArrowRight20Filled />
                    </n-icon>
                  </template>
                  Save Member
                </n-button>
              </n-form-item>
            </n-space>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
    <n-modal style="width: 70%" v-model:show="showAssignModal" preset="dialog">
      <template #header>
        <div>Assign Hotel</div>
      </template>
      <n-space :vertical="true">
        <assign-hotel :id="selectedId" @updated="showAssignModal = false" />
      </n-space>
    </n-modal>
    <n-modal style="width: 40%" v-model:show="showInfoModal" preset="dialog">
      <template #header>
        <div>Member Info</div>
      </template>
      <n-space :vertical="true">
        <member-info :member="selectedId" />
      </n-space>
    </n-modal>
    <!--    </n-space>-->
  </n-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  SaveArrowRight20Filled,
  TextBulletListSquareEdit24Regular,
  Info16Filled,
} from "@vicons/fluent";
import { getBookingApi, updateBookingApi } from "@/api/booking/booking";
import { useRoute } from "vue-router";

const route = useRoute();
const newMember: any = ref({});
const showAssignModal: any = ref(false);
const showInfoModal: any = ref(false);
const selectedId: any = ref(null);
const members: any = ref([]);
const tabValue: any = ref("general");
const bookingGeneralDetails: any = ref({});
const loading = ref(false);
const rules = ref({
  company_name: {
    required: true,
    message: "Please Enter Name",
    trigger: "blur",
  },
});
onMounted(async () => {
  if (route.params.id) {
    getBookingApi(1).then((result) => {
      bookingGeneralDetails.value = {
        customer_name: result.customer_name,
        status: result.status,
        group_no: result.group_no,
        group_name: result.group_name,
        category: result.category,
        approval_date: result.approval_date,
        expected_departure: result.expected_departure,
        confirmed_ticket: result.confirmed_ticket,
      };
      if (result.members) {
        members.value = result.members;
      }
    });
  }
});

function saveGeneralBooking() {
  loading.value = true;
  updateBookingApi(parseInt(String(route.params.id)), {
    ...bookingGeneralDetails.value,
    type: "general",
  }).then((result) => {
    window["$message"].success(result.message);
    loading.value = false;
  });
}

function saveMemberDetails() {
  loading.value = true;
  updateBookingApi(parseInt(String(route.params.id)), {
    ...newMember.value,
    type: "member",
  }).then((result) => {
    newMember.value = {};
    window["$message"].success(result.message);
    loading.value = false;
  });
}

const actionOperation = (id: any) => {
  selectedId.value = id;
  showAssignModal.value = true;
};
const showModel = (member: any) => {
  selectedId.value = member;
  showInfoModal.value = true;
};
// function saveMemberHotel() {
//   console.log(singleHotelDetail);
//   newMember.value.hotelDetails.push(singleHotelDetail.value);
//   singleHotelDetail.value = {};
//   hotel_city.value = null;
//   tabValue.value = 'members';
//   setTimeout(() => {
//     tabValue.value = 'add_members';
//   }, 100);
// }
</script>

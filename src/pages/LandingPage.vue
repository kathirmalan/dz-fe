<script setup>
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { locations } from '@/utils/locations.js'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import Hero from '@/components/Hero.vue'
import MarkerPin from '@/assets/MarkerPin.svg'
import Footer from '@/components/Footer.vue'
import { useBookingStore } from "@/stores/booking"

// Store
const bookingStore = useBookingStore()

const loading = ref(false)
const bookingWizardStep = ref(1)
const copyTpClipboard = ref(false)
const getDestinationSuggestions = ref([])
const selectedDeparture = ref({
  id: 0,
  name: 'Select Pickup location',
  avatar: MarkerPin
})
const selectedDestination = ref({
  id: 0,
  name: 'Select Drop location',
  avatar: MarkerPin
})


const getFormattedTime = (datetime = null) => {
  const now = datetime ? new Date(datetime) : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


const renderDestination = () => {
  if (selectedDeparture.value.id === 1) {
    getDestinationSuggestions.value = locations.filter((location) => {
      return location.id !== selectedDeparture.value.id
    })
  } else {
    getDestinationSuggestions.value = locations.filter((location) => {
      return location.name === 'CDG'
    })
  }
}

const getWizardTitle = () => {
  switch (bookingWizardStep.value) {
    case 1:
      return 'Booking your ride'
    case 2:
      return 'Confirm your ride'
    case 3:
      return 'Success'
    default:
      return ''
  }
}

const booking = reactive({})
const validation_pass = ref(true)
const display_validation_message = ref([])

function validate_booking() {
  validation_pass.value = true
  display_validation_message.value = []

  if (selectedDeparture.value.id == 0 || selectedDestination.value.id == 0) {
    validation_pass.value = false
  }

  if (!booking.vehicle_type) {
    validation_pass.value = false
    console.log("booking.vehicle_type", booking.vehicle_type)
  }

  if (!booking.first_name || !booking.last_name || !booking.contact_number) {
    validation_pass.value = false
    // console.log("booking.first_name ", booking.vehicle_type)
    // console.log("booking.last_name ", booking.last_name)
    // console.log("booking.contact_number ", booking.contact_number)
  }

  if (booking.contact_number) {
    if (!bookingStore.isValidPhoneNumber(booking.contact_number)) {
      validation_pass.value = false
      display_validation_message.value.push('Please enter correct phone number')
    }
  }

  if (booking.contact_number_2) {
    if (!bookingStore.isValidPhoneNumber(booking.contact_number_2)) {
      validation_pass.value = false
    }
  }

  if (validation_pass.value) {
    bookingWizardStep.value = 2
    display_validation_message.value = []
    return
  }

  display_validation_message.value.push('Please enter required informations')
}


async function requestBooking() {
  loading.value = true

  // API call
  const request_body = {
    travel_datetime: booking.departure_date,
    location_pickup: selectedDeparture.value.name,
    location_drop: selectedDestination.value.name,
    vehicle_type: booking.vehicle_type.toUpperCase(),
    fare: booking.vehicle_type.toUpperCase() == "VAN" ? bookingStore.getFares().van : bookingStore.getFares().car,
    comments: null,
    contact_first_name: booking.first_name,
    contact_last_name: booking.last_name,
    country_code: "+33",
    contact_number: booking.contact_number,
    contact_number_2: booking.contact_numner_2 || null
  }
  console.log("request_body", request_body)

  const response = await axios.post(`${import.meta.env.VITE_API_URL}/bookings/`, request_body)
  console.log(response)
  console.log(response.data.reference_number)
  if (response.status == 200 || response.status == 201) {
    // Set Newly created booking number
    booking.booking_reference = response.data.reference_number

    // Check if eixsting booking made
    const l_booking_references = localStorage.getItem("booking_references")

    let tmp_array
    if (!l_booking_references) {
      tmp_array = []
    } else {
      tmp_array = JSON.parse(l_booking_references)
    }

    // Add the booking to the localstorage
    tmp_array.push(response.data.reference_number)
    localStorage.setItem("booking_references", JSON.stringify(tmp_array))

    bookingWizardStep.value = 3
  } else {
    alert("Something went wrong with the booking. Please try again!")
  }

  loading.value = false
}

function copyTpClipboardAction() {
  copyTpClipboard.value = true
}
</script>

<template>
  <Hero />

  <div id="booking"
    class="sm:-mt-[75px] md:-mt-[75px] mb-16 bg-white shadow-lg shadow-[#39876fe8] rounded-md bg-white w-full lg:max-w-[900px] mx-auto rounded-lg px-4 md:px-4 lg:px-8 py-8">
    <div class="w-9/12 m-auto mb-5 after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
      <ol class="grid grid-cols-3 text-sm font-medium text-gray-500">
        <li class="relative flex justify-start text-[#39876fe8]">
          <span class="absolute -bottom-[1.75rem] start-0 rounded-full bg-white text-[#39876fe8]">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fill-rule="evenodd" />
            </svg>
          </span>

          <span class="hidden sm:block"> Details </span>

          <svg class="h-6 w-6 sm:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </li>

        <li
          :class="`relative flex justify-center ${bookingWizardStep === 2 || bookingWizardStep === 3 ? 'text-[#39876fe8]' : ''}`">
          <span
            :class="`absolute -bottom-[1.75rem] left-1/2 -translate-x-1/2 rounded-full ${bookingWizardStep === 2 || bookingWizardStep === 3 ? 'bg-white text-[#39876fe8]' : 'bg-gray-600 text-white'}`">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fill-rule="evenodd" />
            </svg>
          </span>

          <span class="hidden sm:block"> Validation </span>

          <svg class="mx-auto h-6 w-6 sm:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </li>

        <li :class="`relative flex justify-end ${bookingWizardStep === 3 ? 'text-[#39876fe8]' : ''}`">
          <span
            :class="`absolute -bottom-[1.75rem] end-0 rounded-full ${bookingWizardStep === 3 ? 'bg-white text-[#39876fe8]' : 'bg-gray-600 text-white'}`">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fill-rule="evenodd" />
            </svg>
          </span>

          <span class="hidden sm:block"> Confirmation </span>

          <svg class="h-6 w-6 sm:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </li>
      </ol>
    </div>
    <div
      class="text-base font-semibold leading-2 py-3 flex items-center text-xl pb-3 font-bold capitalize text-[#39876fe8] before:flex-[1_1_0%] before:border-t before:me-6 after:flex-[1_1_0%] after:border-t after:ms-6">
      {{ getWizardTitle() }}
    </div>

    <div v-if="bookingWizardStep === 1">
      <div class="w-full mt-3 ring-2 ring-gray-200 bg-gray-50 rounded p-4">
        <div class="grid md:grid-cols-2 md:gap-6">
          <Listbox v-model="selectedDeparture" as="div" @update:model-value="renderDestination">
            <ListboxLabel class="block text-sm font-medium font-semibold leading-6 text-gray-900">Departure
            </ListboxLabel>
            <div class="relative mt-2">
              <ListboxButton
                class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39876fe8] sm:text-sm sm:leading-6">
                <span class="flex items-center">
                  <img :src="selectedDeparture.avatar" alt="" class="h-5 w-5 flex-shrink-0 rounded-sm" />
                  <span class="ml-3 block truncate">{{ selectedDeparture.name }}</span>
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon aria-hidden="true" class="h-5 w-5 text-gray-400" />
                </span>
              </ListboxButton>

              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption v-for="location in locations" :key="location.id" v-slot="{ active, selectedDeparture }"
                    :value="location" as="template">
                    <li :class="[
            active ? 'bg-[#39876fe8] text-white' : 'text-gray-900',
            'relative cursor-default select-none py-2 pl-3 pr-9'
          ]">
                      <div class="flex items-center">
                        <img :src="location.avatar" alt="" class="h-5 w-8 flex-shrink-0 rounded-sm" />
                        <span :class="[
            selectedDeparture ? 'font-semibold' : 'font-normal',
            'ml-3 block truncate'
          ]">{{ location.name }}</span>
                      </div>

                      <span v-if="selectedDeparture" :class="[
            active ? 'text-white' : 'text-[#39876fe8]',
            'absolute inset-y-0 right-0 flex items-center pr-4'
          ]">
                        <CheckIcon aria-hidden="true" class="h-5 w-5" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>

          <Listbox v-model="selectedDestination" as="div" class="mt-5 sm:mt-0">
            <ListboxLabel class="block text-sm font-medium font-semibold leading-6 text-gray-900">Arrival
            </ListboxLabel>
            <div class="relative mt-2">
              <ListboxButton v-if="selectedDestination"
                class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39876fe8] sm:text-sm sm:leading-6">
                <span class="flex items-center">
                  <img :src="selectedDestination.avatar" alt="" class="h-5 w-5 flex-shrink-0 rounded-full" />
                  <span class="ml-3 block truncate">{{ selectedDestination.name }}</span>
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon aria-hidden="true" class="h-5 w-5 text-gray-400" />
                </span>
              </ListboxButton>

              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions v-if="selectedDestination"
                  class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption v-for="location in getDestinationSuggestions" :key="location.id"
                    v-slot="{ active, selectedDestination }" :value="location" as="template">
                    <li :class="[
            active ? 'bg-[#39876fe8] text-white' : 'text-gray-900',
            'relative cursor-default select-none py-2 pl-3 pr-9'
          ]">
                      <div class="flex items-center">
                        <img :src="location.avatar" alt="" class="h-5 w-5 flex-shrink-0 rounded-full" />
                        <span :class="[
            selectedDestination ? 'font-semibold' : 'font-normal',
            'ml-3 block truncate'
          ]">{{ location.name }}</span>
                      </div>

                      <span v-if="selectedDestination" :class="[
            active ? 'text-white' : 'text-[#39876fe8]',
            'absolute inset-y-0 right-0 flex items-center pr-4'
          ]">
                        <CheckIcon aria-hidden="true" class="h-5 w-5" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <div class="space-y-12">
          <div class="pb-2">
            <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label
                  class="block text-sm font-medium font-semibold leading-6 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#39876fe8] focus-visible:outline focus-visible:outline-black"
                  for="first-name">Departure Date</label>
                <div class="mt-2">
                  <input id="departure_date_time" v-model="booking.departure_date" autocomplete="given-name"
                    class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39876fe8] sm:text-sm sm:leading-6"
                    name="first-name" type="datetime-local" />
                </div>
              </div>
              <div class="sm:col-span-3">
                <fieldset>
                  <legend class="text-sm font-semibold leading-6 text-gray-900">
                    Type of Vehicle
                  </legend>
                  <p class="mt-1 text-sm leading-6 text-gray-600"></p>
                  <div class="mt-2 space-y-2">


                    <fieldset class="grid grid-cols-2 gap-4">
                      <legend class="sr-only">Type of Vehicle</legend>

                      <div>
                        <input id="VehicleTypeCAR" v-model="booking.vehicle_type"
                          class="peer hidden [&:checked_+_label_svg]:block" name="VehicleType" type="radio"
                          value="car" />

                        <label
                          class="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-[#39876fe8] peer-checked:ring-1 peer-checked:ring-[#39876fe8]"
                          for="VehicleTypeCAR">
                          <div class="flex items-center justify-between">
                            <p class="text-gray-700">CAR</p>

                            <svg class="hidden h-5 w-5 text-[#39876fe8]" fill="currentColor" viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path clip-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                fill-rule="evenodd" />
                            </svg>
                          </div>

                          <p class="mt-1 text-gray-900 font-bold">€ {{ bookingStore.getFares().car }}</p>
                        </label>
                      </div>

                      <div>
                        <input id="VehicleTypeVAN" class="peer hidden [&:checked_+_label_svg]:block"
                          v-model="booking.vehicle_type" name="VehicleType" type="radio" value="van" />

                        <label
                          class="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-[#39876fe8] peer-checked:ring-1 peer-checked:ring-[#39876fe8]"
                          for="VehicleTypeVAN">
                          <div class="flex items-center justify-between">
                            <p class="text-gray-700">VAN</p>

                            <svg class="hidden h-5 w-5 text-[#39876fe8]" fill="currentColor" viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path clip-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                fill-rule="evenodd" />
                            </svg>
                          </div>

                          <p class="mt-1 text-gray-900 font-bold">€ {{ bookingStore.getFares().van }}</p>
                        </label>
                      </div>
                    </fieldset>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-7  pb-2">
        <h2 class="mt-4 text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
        <p class="-mt-0.5 text-sm leading-6 text-gray-400">Used to contact the passengers</p>

        <div
          class="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 ring-2 ring-gray-200 rounded p-4 pb-6 bg-gray-50">
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium font-semibold leading-6 text-gray-900" for="first-name">First
              name</label>
            <div class="mt-2">
              <input id="first-name" v-model="booking.first_name" autocomplete="given-name"
                class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39876fe8] sm:text-sm sm:leading-6"
                name="first-name" type="text" />
            </div>
          </div>
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium font-semibold leading-6 text-gray-900" for="last-name">Last
              name</label>
            <div class="mt-2">
              <input id="last-name" v-model="booking.last_name" autocomplete="family-name"
                class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39876fe8] sm:text-sm sm:leading-6"
                name="last-name" type="text" />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label class="block text-sm font-medium font-semibold leading-6 text-gray-900"
              for="contact_numner_1">Contact
              number</label>
            <div class="mt-2">
              <input id="contact_numner_1" v-model="booking.contact_number" autocomplete="family-name"
                class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39876fe8] sm:text-sm sm:leading-6"
                name="contact_numner_1" type="text" />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label class="block text-sm font-medium font-semibold leading-6 text-gray-900"
              for="contact_numner_2">Contact
              number (Optional)</label>
            <div class="mt-2">
              <input id="contact_numner_2" v-model="booking.contact_number_2" autocomplete="family-name"
                class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39876fe8] sm:text-sm sm:leading-6"
                name="contact_numner_2" type="text" />
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mt-6">
        <div class="flex justify-center">
          <a disabled
            class="inline-block rounded bg-[#39876fe8] px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-[#39876fe8]"
            href="#booking" @click="validate_booking">
            Book
          </a>
        </div>
        <div class="flex justify-center">
          <ul v-if="display_validation_message && display_validation_message.length" class="mt-2 text-red-400">

            <li v-for="msg, index in display_validation_message" :key="index">{{ msg }}</li>
          </ul>
        </div>

      </div>
    </div>
    <div v-if="bookingWizardStep === 2">
      Preview Pane

      <div class="w-full mt-6">
        <div class="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
          <dl class="-my-3 divide-y divide-gray-100 text-sm">
            <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Pick up location</dt>
              <dd class="text-gray-700 sm:col-span-2">
                <div class="flex items-center">
                  <img :src="locations[0].avatar" alt="" class="h-5 w-8 flex-shrink-0 rounded-sm" />
                  <span :class="[
            selectedDeparture ? 'font-semibold' : 'font-normal',
            'ml-3 block truncate'
          ]">{{ locations[0].name }}</span>
                </div>
              </dd>
            </div>

            <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Drop location</dt>
              <dd class="text-gray-700 sm:col-span-2">
                <div class="flex items-center">
                  <img :src="locations[2].avatar" alt="" class="h-5 w-8 flex-shrink-0 rounded-sm" />
                  <span :class="[
            selectedDestination ? 'font-semibold' : 'font-normal',
            'ml-3 block truncate'
          ]">{{ locations[2].name }}</span>
                </div>
              </dd>
            </div>

            <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Vehicle Type</dt>
              <dd class="text-gray-700 sm:col-span-2">{{ booking.vehicle_type }}</dd>
            </div>

            <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Fare</dt>
              <dd class="text-gray-700 sm:col-span-2 font-bold">€ 60</dd>
            </div>

            <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Journey Date</dt>
              <dd class="text-gray-700 sm:col-span-2">{{ booking.departure_date.replace("T", " ") }}</dd>
            </div>

            <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Name</dt>
              <dd class="text-gray-700 sm:col-span-2">{{ booking.first_name }}</dd>
            </div>

            <div class="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
              <dt class="font-medium text-gray-900">Contact number</dt>
              <dd class="text-gray-700 sm:col-span-2">{{ booking.contact_number }} {{ booking.contact_number_2 ? ", " +
            booking.contact_number_2 : '' }}</dd>
            </div>

          </dl>
        </div>
        <div class="flex justify-between mt-6">
          <a class="inline-block rounded text-[#39876fe8] border border-[#39876fe8] px-8 py-3 text-sm font-medium transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-[#39876fe8]"
            href="#booking" @click="bookingWizardStep = 1">
            Go back
          </a>

          <a class="inline-block rounded bg-[#39876fe8] px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-[#39876fe8]"
            href="#booking" @click="requestBooking">
            <svg v-if="loading" aria-hidden="true"
              class="w-8 h-8 text-gray-200 animate-spin dark:text-white fill-[#39876fe8]" viewBox="0 0 100 101"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
            <span v-else>Confirm</span>
          </a>
        </div>
      </div>
    </div>
    <div v-if="bookingWizardStep === 3">
      <section class="bg-gray-50">
        <div class="mx-auto max-w-screen-xl px-4 py-8 lg:flex">
          <div class="mx-auto max-w-xl text-center">
            <h1 class="text-3xl font-extrabold sm:text-3xl">
              Booking Confirmed
            </h1>
            <h1 class="mt-5">
              Reference Number:
              <strong class="text-3xl sm:text-3xl font-extrabold text-[#39876fe8] sm:block">
                {{ booking.booking_reference }}
              </strong>
            </h1>

            <p class="mt-4 sm:text-xl/relaxed">
              Please save the booking reference details for later usage
            </p>

            <div class="mt-8 flex flex-wrap justify-center gap-4">
              <button @click="copyTpClipboardAction" :disabled="copyTpClipboard"
                class="inline-block rounded bg-[#39876fe8] px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-[#39876fe8]">

                {{ copyTpClipboard ? "Copied!" : "Copy to Clipboard" }}
              </button>
              <a @click="bookingWizardStep = 1" href="#booking"
                class="inline-block rounded border-2 border-[#39876fe8] bg-white px-8 py-3 text-sm font-medium text-[#39876fe8] transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-[#39876fe8]">
                Done
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <Footer></Footer>
</template>

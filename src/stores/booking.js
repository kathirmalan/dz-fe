import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', () => {
    const vehicle_type = ref('CAR')
    function getFares() {
        return {
            car: 60,
            van: 120
        }
    }

    function isValidPhoneNumber(phoneNumber) {
        // Regex to check valid phone number.
        const pattern = /^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/gm  //https://regexr.com/39a2p


        // If the phone number is empty return false
        if (!phoneNumber) {
            return false;
        }

        // Return true if the phone number
        // matched the Regex
        if (pattern.test(phoneNumber)) {
            return true;
        } else {
            return false;
        }
    }

    return { vehicle_type, getFares, isValidPhoneNumber }
})

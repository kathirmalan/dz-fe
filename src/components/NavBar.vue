<script setup>
import driverzone_logo from '@/assets/driverzone_logo.png'
import flag_uk from '@/assets/uk.svg'
import flag_fr from '@/assets/fr.svg'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline/index.js'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
const navigation = [
  { name: 'FAQ', href: '#' },
  { name: 'Contact', href: '#' }
]
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-50">
    <nav aria-label="Global" class="flex items-center justify-between p-6 lg:px-8">
      <div class="flex lg:flex-1">
        <span class="sr-only">DriverZone</span>
        <a
          class="-m-1.5 p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          href="#"
        >
          <span class="sr-only">Your Company</span>
          <img :src="driverzone_logo" alt="" class="h-8 w-auto" />
        </a>
      </div>
      <div class="flex lg:hidden">
        <button
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5text-slate-600"
          type="button"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon aria-hidden="true" class="h-6 w-6 text-white" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          class="text-sm font-semibold leading-6 text-white"
        >{{ item.name }}</a
        >
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <label class="relative inline-flex cursor-pointer items-center">
          <input checked class="peer sr-only" type="checkbox" value="" />
          <div
            class="peer flex h-8 items-center gap-6 rounded-full bg-orange-600 px-3 after:absolute after:left-1 after: after:h-6 after:w-10 after:rounded-full after:bg-white/40 after:transition-all after:content-[''] peer-checked:bg-stone-600 peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700 text-sm text-white"
          >
            <span> <img :src="flag_uk" alt="EN" class="w-5 h-auto" /></span>
            <span> <img :src="flag_fr" alt="FR" class="w-5 h-auto" /></span>
          </div>
        </label>
      </div>
    </nav>
    <Dialog :open="mobileMenuOpen" as="div" class="lg:hidden" @close="mobileMenuOpen = false">
      <div class="fixed inset-0 z-50" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#39876f] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <a
            class="-m-1.5 p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href="#"
          >
            <span class="sr-only">Your Company</span>
            <img :src="driverzone_logo" alt="" class="h-8 w-auto" />
          </a>
          <button
            class="-m-2.5 rounded-md p-2.5 text-white"
            type="button"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon aria-hidden="true" class="h-6 w-6" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-50 hover:text-black"
              >
                {{ item.name }}</a
              >
            </div>
            <div class="py-6">
              <label class="relative inline-flex cursor-pointer items-center">
                <input checked class="peer sr-only" type="checkbox" value="" />
                <div
                  class="peer flex h-8 items-center gap-6 rounded-full bg-orange-600 px-3 after:absolute after:left-1 after: after:h-6 after:w-10 after:rounded-full after:bg-white/40 after:transition-all after:content-[''] peer-checked:bg-stone-600 peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700 text-sm text-white"
                >
                  <span> <img :src="flag_fr" alt="FR" class="w-5 h-auto" /></span>
                  <span> <img :src="flag_uk" alt="EN" class="w-5 h-auto" /></span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<style scoped>

</style>
<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="bg-[url(./assets/tesla_model_s_black-wallpaper-1600x900.jpg)] bg-no-repeat bg-cover">
    <div class="bg-[#39876fe8]">
      <NavBar />

      <div class="relative isolate px-6 lg:pt-8 md:pt-2 lg:px-8">
        <div class="mx-auto max-w-2xl py-24 sm:py-48 lg:py-56">
          <div class="text-center">
            <h1 class="text-2xl font-bold tracking-tight text-white sm:text-6xl">
              Move beyond your choice
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-50">
              We want and act so that the service is not limited only to the transport of people.
              You will be able to take advantage of services to make your trip best!
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <a class="rounded-md bg-transparent ring-2 ring-white px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-[#39876fe8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                href="#booking">Get started</a>

              <!-- <a class="text-sm font-semibold leading-6 text-white" href=" #"
              >Learn more <span aria-hidden="true">→</span></a
              > -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
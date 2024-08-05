<script setup>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
import { FAQ_CONTENT } from '@/utils/faq.js'

console.log(FAQ_CONTENT)

</script>

<template>
    <NavBar fullBg />

    <div class="max-w-screen-xl mx-auto px-5 my-16 py-5 bg-white min-h-sceen">
        <div class="flex flex-col items-center">
            <h2 class="font-bold text-5xl mt-5 tracking-tight">
                FAQ
            </h2>
            <p class="text-neutral-500 text-xl mt-3">
                Frequenty asked questions
            </p>
        </div>
        <div class="grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8">
            <div v-for="question in FAQ_CONTENT" class="py-5" :key="question.id">
                <details class="group">
                    <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
                        <span> {{ question.header }}</span>
                        <span class="transition group-open:rotate-180">
                            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24"
                                width="24">
                                <path d="M6 9l6 6 6-6"></path>
                            </svg>
                        </span>
                    </summary>
                    <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
                        {{ question.answer }}
                    </p>
                </details>
            </div>

        </div>
    </div>

    <Footer />
</template>
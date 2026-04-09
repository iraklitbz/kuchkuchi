<template>
  <div class="min-h-screen bg-white">
    <section class="container mx-auto px-4 py-10 lg:px-6 lg:py-14">
      <div class="mx-auto max-w-3xl">
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Legal</p>
          <h1 class="font-display mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">კონფიდენციალურობის პოლიტიკა</h1>
          <p class="mt-3 text-sm text-zinc-500">ბოლო განახლება: {{ lastUpdated }}</p>
        </div>

        <div class="prose prose-zinc max-w-none prose-headings:font-display prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-li:text-zinc-600">
          <p>
            Kuchkucha-ში ჩვენ ვაფასებთ თქვენს კონფიდენციალურობას. ეს გვერდი განმარტავს, რა ინფორმაციას ვაგროვებთ, როგორ ვიყენებთ მას და როგორ ვიცავთ თქვენს მონაცემებს.
          </p>

          <h2>რა მონაცემებს ვაგროვებთ</h2>
          <ul>
            <li>სახელი და გვარი</li>
            <li>ელფოსტის მისამართი</li>
            <li>ტელეფონის ნომერი</li>
            <li>მისამართი და შეკვეთის დეტალები</li>
            <li>ანგარიშის შექმნისა და შეძენის ისტორია</li>
          </ul>

          <h2>როგორ ვიყენებთ მონაცემებს</h2>
          <ul>
            <li>შეკვეთების დამუშავებისა და მიწოდებისთვის</li>
            <li>თქვენს ანგარიშთან დაკავშირებული კომუნიკაციისთვის</li>
            <li>ელფოსტის დადასტურებისა და პაროლის აღდგენისათვის</li>
            <li>მომსახურების გაუმჯობესებისთვის</li>
          </ul>

          <h2>მესამე მხარეები</h2>
          <p>
            ჩვენ შეიძლება გამოვიყენოთ სერვისები, როგორიცაა Strapi, Resend და Cloudinary, რათა საიტი იმუშაოს სწორად. ამ სერვისებს შესაძლოა ჰქონდეთ წვდომა მხოლოდ იმ მონაცემებზე, რაც აუცილებელია მათი ფუნქციის შესასრულებლად.
          </p>

          <h2>ქუქიები და ადგილობრივი შენახვა</h2>
          <p>
            საიტი იყენებს ქუქიებსა და localStorage-ს, მაგალითად, ავტორიზაციის სესიისა და კალათის შესანახად.
          </p>

          <h2>უსაფრთხოება</h2>
          <p>
            ვიღებთ გონივრულ ტექნიკურ ზომებს თქვენი მონაცემების დასაცავად, თუმცა ინტერნეტით გადაცემული ინფორმაცია არასოდეს არის 100%-ით უსაფრთხო.
          </p>

          <h2>თქვენი უფლებები</h2>
          <p>
            შეგიძლიათ მოითხოვოთ თქვენს მონაცემებზე წვდომა, მათი გასწორება ან წაშლა, თუ ეს კანონის ფარგლებში შესაძლებელია.
          </p>

          <h2>კონტაქტი</h2>
          <p>
            კითხვების შემთხვევაში მოგვწერეთ: <a href="mailto:kutchkutchi333@gmail.com">kutchkutchi333@gmail.com</a>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'კონფიდენციალურობის პოლიტიკა — Kuchkucha',
  description: 'How Kuchkucha collects and uses personal data.',
})

const lastUpdated = '2026-04-09'
</script>

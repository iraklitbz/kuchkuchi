<template>
  <div class="min-h-screen bg-white">
    <section class="container mx-auto px-4 py-10 lg:px-6 lg:py-14">
      <div class="mx-auto max-w-3xl">
        <div class="mb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Legal</p>
          <h1 class="font-display mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">მომსახურების პირობები</h1>
          <p class="mt-3 text-sm text-zinc-500">ბოლო განახლება: {{ lastUpdated }}</p>
        </div>

        <div class="prose prose-zinc max-w-none prose-headings:font-display prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-li:text-zinc-600">
          <p>
            Kuchkucha-ს გამოყენებით თქვენ ეთანხმებით ქვემოთ მოცემულ პირობებს. ეს ტექსტი შექმნილია მარტივად და გასაგებად.
          </p>

          <h2>საიტის გამოყენება</h2>
          <p>
            თქვენ შეგიძლიათ გამოიყენოთ საიტი პროდუქციის დასათვალიერებლად, კალათაში დამატებისა და შეკვეთის გასაფორმებლად.
          </p>

          <h2>ანგარიში</h2>
          <p>
            თუ ქმნით ანგარიშს, ვალდებული ხართ მიუთითოთ სწორი და აქტიური ინფორმაცია და შეინახოთ თქვენი ავტორიზაციის მონაცემები უსაფრთხოდ.
          </p>

          <h2>შეკვეთები და გადახდა</h2>
          <p>
            შეკვეთის გაფორმებით თქვენ ადასტურებთ, რომ მიწოდებისა და საკონტაქტო ინფორმაცია სწორია. ფასები და ხელმისაწვდომობა შეიძლება შეიცვალოს წინასწარი შეტყობინების გარეშე.
          </p>

          <h2>მიწოდება</h2>
          <p>
            მიწოდების დრო დამოკიდებულია შეკვეთის მოცულობასა და მისამართზე. ჩვენ ვეცდებით, შეკვეთები დროულად დავამუშავოთ.
          </p>

          <h2>აკრძალული ქმედებები</h2>
          <ul>
            <li>საიტის არალეგალური გამოყენება</li>
            <li>სისტემის ან სხვა მომხმარებლის მოტყუება</li>
            <li>უსაფრთხოების ან ხელმისაწვდომობის დაზიანება</li>
          </ul>

          <h2>შეზღუდული პასუხისმგებლობა</h2>
          <p>
            ჩვენ ვცდილობთ საიტის მუდმივ მუშაობას, მაგრამ არ ვიძლევით გარანტიას, რომ ყველაფერი ყოველთვის შეუფერხებლად იმუშავებს. რამდენადაც კანონი ნებას რთავს, პასუხისმგებლობა შეზღუდულია.
          </p>

          <h2>შენიშვნები ცვლილებებზე</h2>
          <p>
            შეიძლება დრო და დრო განვაახლოთ ეს პირობები. განახლებული ვერსია გამოქვეყნდება ამავე გვერდზე.
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
  title: 'მომსახურების პირობები — Kuchkucha',
  description: 'Terms of service for Kuchkucha.',
})

const lastUpdated = '2026-04-09'
</script>

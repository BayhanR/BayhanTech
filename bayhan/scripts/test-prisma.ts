import { prisma } from '../lib/prisma'

async function testPrisma() {
  try {
    console.log('🔍 Prisma bağlantısı test ediliyor...\n')

    // 1. Basit bağlantı testi
    await prisma.$connect()
    console.log('✅ Prisma veritabanına başarıyla bağlandı\n')

    // 2. User sayısını kontrol et
    const userCount = await prisma.user.count()
    console.log(`📊 Toplam kullanıcı sayısı: ${userCount}`)

    // 3. Company sayısını kontrol et
    const companyCount = await prisma.company.count()
    console.log(`📊 Toplam şirket sayısı: ${companyCount}`)

    // 4. Profile sayısını kontrol et
    const profileCount = await prisma.profile.count()
    console.log(`📊 Toplam profil sayısı: ${profileCount}\n`)

    // 5. İlk kullanıcıyı göster (varsa)
    const firstUser = await prisma.user.findFirst({
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    })

    if (firstUser) {
      console.log('👤 İlk kullanıcı:')
      console.log(`   - Email: ${firstUser.email}`)
      console.log(`   - ID: ${firstUser.id}`)
      if (firstUser.profile) {
        console.log(`   - Şirket: ${firstUser.profile.company.name}`)
        console.log(`   - Kategori: ${firstUser.profile.company.category}`)
      }
    } else {
      console.log('⚠️  Henüz kullanıcı yok. Seed çalıştırmayı düşün: npm run prisma:seed')
    }

    console.log('\n✅ Prisma testi başarılı!')
  } catch (error) {
    console.error('❌ Prisma hatası:', error)
    if (error instanceof Error) {
      console.error('   Hata mesajı:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testPrisma()


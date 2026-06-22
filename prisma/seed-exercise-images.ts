import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Imagens hospedadas no Google Drive (links diretos via lh3.googleusercontent.com).
// Cada foto foi escolhida para condizer com o respectivo exercício.
const driveImg = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

const mapping: { title: string; imageUrl: string; foto: string }[] = [
  {
    title: 'Técnica de Respiração 4-7-8',
    imageUrl: driveImg('1sO9uGjgLnNa-WxSrnVBN-GElMHoqBl_I'),
    foto: 'mulher relaxada fazendo respiração (mãos no peito)',
  },
  {
    title: 'Exercícios de Alongamento para Relaxar',
    imageUrl: driveImg('15Z0HyRIwDC819Mw86GwcGrEwjwbjj5o8'),
    foto: 'mulheres fazendo yoga',
  },
  {
    title: 'Exercício de Gratidão Diária',
    imageUrl: driveImg('1q3LDCP_1Ijd3uUmMibdDh3eVkOKFupz9'),
    foto: 'mão escrevendo no caderno',
  },
  {
    title: 'Técnica de Grounding 5-4-3-2-1',
    imageUrl: driveImg('1piU0wuwfV1C-h5DdxdkLt-fRlVWPsV19'),
    foto: 'mulher sentada ao ar livre',
  },
  {
    title: 'Diário de Autoestima',
    imageUrl: 'https://images.pexels.com/photos/27102013/pexels-photo-27102013.jpeg',
    foto: 'imagem do Pexels (autoestima)',
  },
];

async function main() {
  console.log('🖼️  Adicionando fotos aos exercícios...\n');

  for (const m of mapping) {
    const res = await prisma.resource.updateMany({
      where: { title: m.title },
      data: { imageUrl: m.imageUrl },
    });
    const status = res.count > 0 ? '✅' : '⚠️  (nenhum exercício com esse título)';
    console.log(`  ${status} ${m.title} — ${m.foto}`);
  }

  console.log('\n🎉 Fotos dos exercícios atualizadas!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao adicionar fotos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

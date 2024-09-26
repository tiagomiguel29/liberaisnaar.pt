import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Liberais Na AR',
    short_name: 'Liberais Na AR',
    description: "Acompanha a atividade dos deputados liberais na Assembleia da República. Recebe notificações de novas iniciativas e sobre atualizações de iniciativas que segues.",
    start_url: '/',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
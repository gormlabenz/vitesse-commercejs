// register vue composition api globally
import App from './App.vue'
import { routes } from './router'
import './styles/main.css'
import { ViteSSG } from 'vite-ssg'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
    App,
    { routes, base: import.meta.env.BASE_URL },
    async (ctx) => {
        // install all modules under `modules/`
        if (ctx.isClient) {
            Object.values(import.meta.globEager('./modules/*.js')).forEach(
                (i) => {
                    i.install?.(ctx)
                }
            )
        } else {
            for (const i of Object.values(
                import.meta.globEager('./modules/*.js')
            )) {
                await i.install?.(ctx)
            }
        }
    }
)

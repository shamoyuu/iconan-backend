import Vue from 'vue'
import Router from 'vue-router'
import Opus from '@/components/Opus'
import Chapter from '@/components/Chapter'
import Picture from '@/components/Picture'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/opus',
            name: 'opus',
            component: Opus
        },
        {
            path: '/chapter/:opusid',
            name: 'chapter',
            component: Chapter
        },
        {
            path: '/picture/:chapterid',
            name: 'picture',
            component: Picture
        }
    ]
})

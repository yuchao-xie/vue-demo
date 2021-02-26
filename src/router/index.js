import Vue from 'vue'
import Router from 'vue-router'
import knowledgeMap from '@/module/knowledge-map.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',//去除哈希值的#号
    routes: [
        {
            path: '*',
            redirect: '/knowledge-map'
        },
        {
            path: '/knowledge-map',
            name: 'knowledge-map',
            component: knowledgeMap
        }
    ]
})

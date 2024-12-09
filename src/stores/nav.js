import {defineStore} from 'pinia'
import {ref} from 'vue'


export const useNavStore = defineStore('nav', () => {

    //定义全局数据
    const activeNavbar = ref(['1'])


    //定义修改导航栏方法
    function setActiveNavbar(nav) {
        activeNavbar.value = nav
    }

    return {
        activeNavbar,
        setActiveNavbar
    }
})
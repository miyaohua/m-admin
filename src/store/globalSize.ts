import { defineStore } from 'pinia'
import { ref } from 'vue'



export const useGlobalSizeStore = defineStore('globalSize',
    () => {
        enum size {
            large = "large",
            middle = "middle",
            small = "small"
        }

        const globalSize = ref('middle');

        const setGlobalSize = (newValue: string) => {
            switch (newValue) {
                case "large":
                    globalSize.value = size.large
                    break;
                case "middle":
                    globalSize.value = size.middle
                    break;
                case "small":
                    globalSize.value = size.small
                    break
                default:
                    globalSize.value = size.large
                    break
            }
        }


        return {
            globalSize,
            setGlobalSize,
        }
    },
    {
        persist: true
    }
)

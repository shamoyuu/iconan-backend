import ImageShowComponent from "@/components/common/ImageShow"

let $vm

export default {
    install(Vue, options) {
        Vue.mixin({
            created() {
                this.$imageShow = {
                    show(img) {
                        if (!$vm) {
                            const ImageShow = Vue.extend(ImageShowComponent);
                            $vm = new ImageShow({
                                el: document.createElement('div')
                            });
                            document.body.appendChild($vm.$el);
                            $vm.show = false;
                        }

                        $vm.show = true;
                        $vm.img = img;
                    },
                    hide() {
                        $vm.show = false;
                    }
                };
            }
        });
    }
}

import { computed } from 'vue';
import { VueShowdown } from 'vue-showdown';
import { useRoute } from 'vue-router';
import { UseFullscreen } from '@vueuse/components';
import { EpFullScreen } from 'vue-icons-plus/ep';
import { BsFullscreenExit } from 'vue-icons-plus/bs';
import { BASE_URL } from '@/config';
const route = useRoute();
const hash = computed(() => route.hash);
const articles = Object.freeze(Object.values(import.meta.glob('./articles/*.md', { eager: true })).map(file => file.markdown));
const titleList = Object.freeze(articles.map(article => article.split('\n')[0]?.replace('#', '').trim()));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "juejin-notes" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "jn-directory" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "jn-container" },
});
for (const [_, index] of __VLS_getVForSourceType((__VLS_ctx.articles))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
        key: (__VLS_ctx.titleList[index]),
        ...{ class: "jn-article-title" },
        href: (`${__VLS_ctx.BASE_URL}/juejin-notes#${__VLS_ctx.titleList[index]}`),
        ...{ class: ({ active: `#${__VLS_ctx.titleList[index]}` === __VLS_ctx.hash }) },
        title: (__VLS_ctx.titleList[index]),
    });
    (__VLS_ctx.titleList[index]);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "jn-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "jn-container" },
});
for (const [article, index] of __VLS_getVForSourceType((__VLS_ctx.articles))) {
    const __VLS_0 = {}.UseFullscreen;
    /** @type {[typeof __VLS_components.UseFullscreen, typeof __VLS_components.useFullscreen, typeof __VLS_components.UseFullscreen, typeof __VLS_components.useFullscreen, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        id: (__VLS_ctx.titleList[index]),
        key: (index),
        ...{ class: "jn-article" },
        ...{ class: ({ active: `#${__VLS_ctx.titleList[index]}` === __VLS_ctx.hash }) },
    }));
    const __VLS_2 = __VLS_1({
        id: (__VLS_ctx.titleList[index]),
        key: (index),
        ...{ class: "jn-article" },
        ...{ class: ({ active: `#${__VLS_ctx.titleList[index]}` === __VLS_ctx.hash }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    {
        const { default: __VLS_thisSlot } = __VLS_3.slots;
        const [{ isFullscreen, toggle }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_4 = {}.VueShowdown;
        /** @type {[typeof __VLS_components.VueShowdown, typeof __VLS_components.vueShowdown, typeof __VLS_components.VueShowdown, typeof __VLS_components.vueShowdown, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            markdown: (article),
            flavor: "allOn",
            title: (__VLS_ctx.titleList[index]),
        }));
        const __VLS_6 = __VLS_5({
            markdown: (article),
            flavor: "allOn",
            title: (__VLS_ctx.titleList[index]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        if (isFullscreen) {
            const __VLS_8 = {}.BsFullscreenExit;
            /** @type {[typeof __VLS_components.BsFullscreenExit, typeof __VLS_components.bsFullscreenExit, typeof __VLS_components.BsFullscreenExit, typeof __VLS_components.bsFullscreenExit, ]} */ ;
            // @ts-ignore
            const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
                ...{ 'onClick': {} },
                ...{ class: "jn-icon" },
            }));
            const __VLS_10 = __VLS_9({
                ...{ 'onClick': {} },
                ...{ class: "jn-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_9));
            let __VLS_12;
            let __VLS_13;
            let __VLS_14;
            const __VLS_15 = {
                onClick: (toggle)
            };
            var __VLS_11;
        }
        else {
            const __VLS_16 = {}.EpFullScreen;
            /** @type {[typeof __VLS_components.EpFullScreen, typeof __VLS_components.epFullScreen, typeof __VLS_components.EpFullScreen, typeof __VLS_components.epFullScreen, ]} */ ;
            // @ts-ignore
            const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
                ...{ 'onClick': {} },
                ...{ class: "jn-icon" },
            }));
            const __VLS_18 = __VLS_17({
                ...{ 'onClick': {} },
                ...{ class: "jn-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_17));
            let __VLS_20;
            let __VLS_21;
            let __VLS_22;
            const __VLS_23 = {
                onClick: (toggle)
            };
            var __VLS_19;
        }
        __VLS_3.slots['' /* empty slot name completion */];
    }
    var __VLS_3;
}
/** @type {__VLS_StyleScopedClasses['juejin-notes']} */ ;
/** @type {__VLS_StyleScopedClasses['jn-directory']} */ ;
/** @type {__VLS_StyleScopedClasses['jn-container']} */ ;
/** @type {__VLS_StyleScopedClasses['jn-article-title']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['jn-content']} */ ;
/** @type {__VLS_StyleScopedClasses['jn-container']} */ ;
/** @type {__VLS_StyleScopedClasses['jn-article']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['jn-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['jn-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VueShowdown: VueShowdown,
            UseFullscreen: UseFullscreen,
            EpFullScreen: EpFullScreen,
            BsFullscreenExit: BsFullscreenExit,
            BASE_URL: BASE_URL,
            hash: hash,
            articles: articles,
            titleList: titleList,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

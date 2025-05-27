<template>
    <div v-if="isLoading"
        class="fixed top-4 left-4 flex items-center space-x-2 bg-gray-800 bg-opacity-75 text-white p-2 pr-4 rounded">
        <div class="spinner animate-spin border-t-4 border-blue-500 border-solid rounded-full w-6 h-6"></div>
        <div class="phrase-container pl-2">
            <span :key="currentPhrase" class="phrase">{{ currentPhrase }}</span>
        </div>
    </div>
    <div v-else
        class="fixed top-4 left-4 flex items-center space-x-2 bg-gray-800 bg-opacity-75 text-white p-2 pr-4 rounded">
        <div class="checkmark w-5 h-5 flex items-center justify-center">
            <svg class=" fill-green-700" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" width="122.877px" height="101.052px" viewBox="0 0 122.877 101.052"
                enable-background="new 0 0 122.877 101.052" xml:space="preserve">
                <g>
                    <path
                        d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z" />
                </g>
            </svg>
        </div>
        <div class="phrase-container pl-2">
            <span :key="currentPhrase" class="phrase">Готово!</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isLoading: true, // Manage the loading state locally
            phrases: [
                "Запускаем сервер… подождите.",
                "О да, загрузка… всё идёт по плану.",
                "Не переживайте, сервер тоже отдыхает.",
                "Мы вообще-то почти закончили… ещё пара лет.",
                "Терпение — ключ к величию. Ожидайте.",
                "Загружаем… уже начали… почти… через пару веков.",
                "Процесс начался. Мы бы сказали «пока», но это не скоро."
            ],
            currentPhraseIndex: 0
        };
    },
    computed: {
        currentPhrase() {
            return this.phrases[this.currentPhraseIndex];
        }
    },
    mounted() {
        // Start the interval to change phrases every 5 seconds
        this.startPhraseLoop();

        // // Simulate a backend startup time, hide the spinner after 50 seconds (adjust based on your needs)
        // setTimeout(() => {
        //     this.isLoading = false;
        // }, 50000); // Adjust this based on how long your backend takes to start
    },
    methods: {
        startPhraseLoop() {
            setInterval(() => {
                if (this.isLoading) {
                    this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
                }
            }, 5000); // Change phrase every 5 seconds
        }
    }
};
</script>

<style scoped>
.spinner {
    border-width: 2px;
    border-color: transparent;
    border-top-color: #00b0ff;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}

.phrase-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.phrase {
    opacity: 0;
    animation: fadeInOut 5s ease-in-out infinite;
    font-size: 14px;
    font-weight: 500;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    20% {
        opacity: 1;
        transform: translateY(0);
    }

    80% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(10px);
    }
}
</style>

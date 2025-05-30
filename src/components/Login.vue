<template>
    <Spinner :is-loading="isLoading" />
    <div class="min-h-screen bg-dark text-white flex items-center justify-center">
        <div class="w-full max-w-sm p-8 bg-[#161C2A] rounded-xl shadow-lg mb-32">
            <h2 class="text-2xl font-semibold text-center mb-6">Вход</h2>
            <form @submit.prevent="tryLogin" class="space-y-4">
                <div>
                    <input v-model="login" type="text" id="Username-input" autocomplete="username"
                        class="w-full p-2 border-[#202938] bg-[#202938] text-white rounded-md border focus:outline-none"
                        placeholder="Логин" />
                </div>
                <div class="relative w-full">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" id="Password-input"
                        autocomplete="current-password"
                        class="w-full p-2 pr-10 border-[#202938] bg-[#202938] text-white rounded-md border focus:outline-none"
                        placeholder="Пароль" />
                    <button type="button" @click="togglePassword"
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-white focus:outline-none"
                        aria-label="Toggle password visibility">
                        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.057 10.057 0 012.583-4.002M9.88 9.88a3 3 0 104.24 4.24M3 3l18 18" />
                        </svg>
                    </button>
                    <!-- <input v-model="password" type="password" id="Password-input" autocomplete="current-password"
                        class="w-full p-2 border-[#202938] bg-[#202938] text-white rounded-md border focus:outline-none"
                        placeholder="Пароль" /> -->
                </div>
                <div>
                    <select v-model="authType" id="select"
                        class="w-full border-r-8 p-2 cursor-pointer border-[#202938] bg-[#202938] text-white rounded-md border focus:outline-none">
                        <option value="teleopti">Teleopti</option>
                        <option value="adfs">ADFS Single Sign On</option>
                    </select>
                </div>
                <!-- <button type="submit"
                    class="w-full py-2 bg-blue-600 font-extralight text-white rounded-md hover:bg-blue-700 focus:outline-none">
                    Войти
                </button> -->
                <button type="submit" :disabled="isLoading || isLogging"
                    class="w-full py-2 bg-blue-600 font-extralight text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center">
                    <span v-if="isLogging" class="loader mr-2"></span>
                    <span>{{ isLogging ? 'Входим...' : 'Войти' }}</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginTeleopti } from '@/services/teleoptiService'
import { pingServer } from '@/services/startupService';
import { showToast } from '@/composables/useToast';

const router = useRouter()
const login = ref('');
const password = ref('');
const authType = ref('teleopti');
const isLoading = ref(false);
const isLogging = ref(false);
const showPassword = ref(false);

onMounted(async () => {
    pingServer(isLoading);
});

async function tryLogin() {

    if (authType.value === 'adfs') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailPattern.test(login.value);
        if (!isEmail) {
            showToast('Введите корректный email в формате "пользователь@домен".');
            return;
        }
    }

    isLogging.value = true;
    const cookies = await loginTeleopti(login.value, password.value, authType.value);
    if (cookies) {
        console.log('Login successful:', cookies);
        router.push({ name: 'calendar' });
    } else {
        isLogging.value = false;
        console.error('Login failed');
    }
}

function togglePassword() {
    showPassword.value = !showPassword.value;
};

</script>

<style scoped>
/* Custom styles (if needed) */
</style>
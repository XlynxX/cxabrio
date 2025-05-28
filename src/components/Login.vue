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
                <div>
                    <input v-model="password" type="password" id="Password-input" autocomplete="current-password"
                        class="w-full p-2 border-[#202938] bg-[#202938] text-white rounded-md border focus:outline-none"
                        placeholder="Пароль" />
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

const router = useRouter()
const login = ref('');
const password = ref('');
const authType = ref('teleopti');
const isLoading = ref(false);
const isLogging = ref(false);

onMounted(async () => {
    pingServer(isLoading);
});

async function tryLogin() {
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
</script>

<style scoped>
/* Custom styles (if needed) */
</style>
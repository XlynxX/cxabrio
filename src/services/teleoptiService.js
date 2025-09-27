import { showToast } from "@/composables/useToast";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export async function fetchTeamsAndGroups(unixDate) {
  // console.log(unixDate);
  // Format the date as "YYYY/MM/DD"
  const date = new Date(unixDate);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  // console.log(unixDate);
  // console.log(formattedDate);
  
  
  
  const url = `https://teleopti.nordic.webhelp.com/TeleoptiWFM/Web/MyTime/Team/TeamsAndGroupsWithAllTeam?date=${formattedDate}&_=${unixDate}`
  // console.log(url);

  const response = await fetch(`${baseUrl}/proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetUrl: url, // Use the dynamically formatted date URL
      cookie: localStorage.getItem('teleoptiCookie'), // Retrieve the cookie from local storage
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Teleopti data");
  }

  // console.log(await response.json());
  return await response.json();
}

export async function fetchMonthData(unixDate) {
  // Convert the Unix timestamp to a Date object
  const date = new Date(unixDate);

  // Format the date as "YYYY/MM/DD"
  const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

  // URL with the formatted date
  const url = `https://teleopti.nordic.webhelp.com/TeleoptiWFM/Web/api/Schedule/FetchMonthData?date=${formattedDate}`;

  //cors-proxy-4qjr.onrender.com
  //https://localhost:10000/proxy
  const response = await fetch(`${baseUrl}/proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetUrl: url, // Use the dynamically formatted date URL
      cookie: localStorage.getItem('teleoptiCookie'), // Retrieve the cookie from local storage
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Teleopti data");
  }

  return await response.json();
}

export async function fetchWeekData(unixDate) {
  // Convert the Unix timestamp to a Date object
  const date = new Date(unixDate);

  // Format the date as "YYYY/MM/DD"
  const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

  // URL with the formatted date
  const url = `https://teleopti.nordic.webhelp.com/TeleoptiWFM/Web/api/Schedule/FetchWeekData?date=${formattedDate}`;

  //cors-proxy-4qjr.onrender.com
  const response = await fetch(`${baseUrl}/proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetUrl: url, // Use the dynamically formatted date URL
      cookie: localStorage.getItem('teleoptiCookie'), // Retrieve the cookie from local storage
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Teleopti data");
  }

  return await response.json();
}

export async function loginTeleopti(username, password, authType) {

  const res = await fetch(`${baseUrl}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
      authType: authType,
    })
  });

  if (!res.ok) {
    res.json().then(data => {
      showToast(data.error);
    });
    return false; // Return false if the login fails
  }

  console.log(res.headers);

  localStorage.setItem('teleoptiCookie', res.headers.get('calabrio'));

  let data = await res.json();
  return { username: data.username };

  // const url = 'https://teleopti.nordic.webhelp.com/TeleoptiWFM/Web/SSO/ApplicationAuthenticationApi/Password';
  // const wfmUrl = 'https://teleopti.nordic.webhelp.com/TeleoptiWFM/Web/Start/AuthenticationApi/Logon';
  // const xsrfUrl = 'https://teleopti.nordic.webhelp.com/TeleoptiWFM/Web/Authentication/RedirectToSignIn?ru=%2FTeleoptiWFM%2FWeb%2FMyTime';

  // // Fetch the XSRF token
  // const tokenRes = await fetch('http://localhost:10000/proxy', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     targetUrl: xsrfUrl,
  //   })
  // });

  // if (!tokenRes.ok) {
  //   throw new Error("Failed to fetch XSRF token");
  // }

  // let xsrfToken = '';
  // let xsrfTokenValue = '';
  // const tokenData = await tokenRes.json();
  // for (const cookie of tokenData.cookies) {
  //   if (cookie.key === '__RequestVerificationToken_MainWeb') {
  //     xsrfToken = `${cookie.key}=${cookie.value};`;
  //     xsrfTokenValue = cookie.value;
  //     break;
  //   }
  // }

  // const response = await fetch('http://localhost:10000/proxy', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     targetUrl: url,
  //     method: 'POST',
  //     type: 'application',
  //     rememberMe: true,
  //     IsLogonFromBrowser: true,
  //     username: username,
  //     password: password,
  //   }),
  // });

  // if (!response.ok) {
  //   throw new Error("Failed to login to Teleopti");
  // }

  // const data = await response.json();

  // if (!data.cookies) {
  //   throw new Error("No cookies received from Teleopti");
  // }

  // const regex = /(TeleoptiIpAuth=[A-Za-z0-9]+#;)/;
  // const match = (data.cookies.toString()).match(regex);
  // if (match) {
  //   // Store the cookie in local storage
  //   localStorage.setItem('teleoptiCookie', xsrfToken + match[1]);
  // }

  // const res = await fetch('http://localhost:10000/proxy', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     targetUrl: wfmUrl,
  //     cookie: localStorage.getItem('teleoptiCookie'),
  //     headers: {
  //       'x-xsrf-token': xsrfTokenValue,
  //     },
  //     isClient: true,
  //     method: 'POST',
  //     IsLogonFromBrowser: true,
  //     businessUnitId: '96fc366b-99cc-417c-8278-abd600c90551'
  //   }),
  // });

  // return true;
}

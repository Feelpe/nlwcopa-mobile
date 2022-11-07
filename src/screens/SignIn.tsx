import { Fontisto } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Box, Center, Icon, Text } from 'native-base'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'

import { Button } from '../components/Button'
import { Loading } from '../components/Loading'

import Logo from '../assets/logo.svg'

export function SignIn() {
  const { signIn, isUserLoading, user, setUser } = useAuth()
  const { navigate } = useNavigation()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const token = await AsyncStorage.getItem("@storage_Key:token");
        if (token !== null && !user?.name) {
          if (token !== null) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const userInfoResponse = await api.get("/me");

            setUser(userInfoResponse.data.user);
            navigate("new")
          }
        }
      } catch (error) {
        await AsyncStorage.removeItem("@storage_Key:token");
        await AsyncStorage.removeItem("@storage_Key:user");
      } finally {
        setIsLoading(false)
      }
    })();
  }, [user]);

  if (isLoading)
    return (
      <Loading />
    )

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      {Platform.OS != 'web' ? <Logo width={212} height={40} /> : <Box />}

      <Button
        type="SECONDARY"
        title="Entrar com o Google"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        mt={12}
        onPress={signIn}
        isLoading={isUserLoading}
        _loading={{ _spinner: { color: 'white' } }}
      />

      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {'\n'}
        do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  )
}
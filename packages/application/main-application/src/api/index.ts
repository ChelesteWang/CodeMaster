import http from '@cdl-pkg/request'

export const loginByPhoneAction = async (phoneNumber: string, code: string) => {
  const {
    data: { result }
  } = await http.post('/api/user/login_phone', { phoneNumber, code })
  return result
}

export const currentAction = async () => {
  const r = await http.get('/api/user/current')
  return r?.data?.result
}

export const sendSMSAction = async (phoneNumber: string) => {
  const {
    data: { result }
  } = await http.post('/api/user/send_sms', { phoneNumber })
  return result
}

export const loginByPasswordAction = async (
  username: string,
  password: string
) => {
  const {
    data: { result }
  } = await http.post('/api/user/login_password', {
    username,
    password
  })
  return result
}

export const registerAction = async (username: string, password: string) => {
  const {
    data: { result }
  } = await http.post('/api/user/register', { username, password })
  return result
}
export const logoutAction = async () => {
  const {
    data: { result }
  } = await http.put('/api/user/logout')
  return result
}

export const changePasswordAction = async (newPassword: string) => {
  const {
    data: { result }
  } = await http.put('/api/user/change_password', { newPassword })
  return result
}

export const userUpdateAction = async (user: string) => {
  const {
    data: { result }
  } = await http.put('/api/user/user_update', { user })
  return result
}

export const fileDeleteAction = async (id: string) => {
  const {
    data: { result }
  } = await http.delete(`/api/file/delete/${id}`)
  return result
}

export const getContentAction = async (id: string) => {
  const {
    data: { result }
  } = await http.get(`/api/file/content/${id}`)
  return result
}

// export const fileDownloadAction = async (id: string) => {
//   try {
//     const res = await fetch(`/api/file/${id}`, {
//       method: 'GET'
//     })
//     res.blob().then((blob) => {
//       const eleA = document.createElement('a')
//       const filename = res.headers.get('Content-Disposition').split('=')[1]
//       eleA.download = decodeURIComponent(filename)
//       eleA.style.display = 'none'
//       eleA.href = URL.createObjectURL(blob)
//       document.body.appendChild(eleA)
//       eleA.click()
//       URL.revokeObjectURL(eleA.href) //释放URL对象
//       document.body.removeChild(eleA)
//     })
//   } catch (e) {
//     console.log(e)
//   }
// }

export const fileUploadAction = async (formData: string) => {
  const {
    data: { result }
  } = await http.post('/api/file/upload', formData, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
  return result
}

export const jsonSchemaFindByUserAction = async () => {
  const {
    data: { result }
  } = await http.get('/api/json_schema/find_by_user')
  return result
}

export const jsonSchemaFindAllAction = async () => {
  const {
    data: { result }
  } = await http.get('/api/json_schema/list_all')
  return result
}

export const jsonSchemaCreateAction = async (createObj: object) => {
  const {
    data: { result }
  } = await http.post(`/api/json_schema/create`, createObj)
  return result
}

export const jsonSchemaDeleteAction = async (id: string) => {
  const {
    data: { ok }
  } = await http.delete(`/api/json_schema/delete/${id}`)
  return ok
}

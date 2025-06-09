import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  components: {
    Stack: {
      baseStyle: {
        spacing: 4
      }
    }
  }
})

export default theme 
<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <h1 class="display-4">{{ title }}</h1>
        <v-btn color="primary">Vote yes</v-btn>
        <v-btn color="error">Vote no</v-btn>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: 'Humans Vote',
    }
  }
}
</script>

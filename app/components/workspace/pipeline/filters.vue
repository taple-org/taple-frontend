<script lang="ts" setup>
const { r$: form } = useRegle(
    {
      search: "",
      product_id: "",
      point_type: ""
    },{
      search: {  }
    }
)

</script>
<template>
  <form class="filter">
    <ui-form-field class="filter__search" type="text" v-model="form.$value.search" icon-left="my-icon-search"
                   placeholder="Поиск по названию / адресу / телефону"/>
    <div class="filter__selectors">
      <ui-form-field class="filter__selector" type="select" v-model="form.$value.product_id" :options="[{ label: 'Донерка', value: '1234567890' }]" placeholder="Продукт"/>
      <ui-form-field class="filter__selector" type="select" v-model="form.$value.point_type" :options="[{ label: 'Донерная', value: '1234567890' }]" placeholder="Тип точки"/>
    </div>
  </form>
</template>

<style scoped>
.filter{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 25px 0 20px;
}
.filter__selectors{
  display: flex;
  gap: 5px
}

.filter__search {
  flex-grow: 1;
}
</style>
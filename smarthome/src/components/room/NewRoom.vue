<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>房间名称</label>
        <input type="text" class="form-control" v-model="name" placeholder="Name">
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <label>房间介绍</label>
        <input type="text" class="form-control" v-model="comment" placeholder="Comment">
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <router-link to="/show-rooms" class="btn btn-danger">取消</router-link>
    <hr>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        name: '',
        comment: '',
      };
    },
    methods: {
      save() {
        if (this.name === '' || this.name.trim() === '') {
          alert('房间名不能为空！'); // eslint-disable-line
        } else {
          const room = {
            name: this.name,
            comment: this.comment,
          };
          this.$store.dispatch('saveRoom', room);
          this.$router.go(-1);
        }
      },
    },
  };
</script>

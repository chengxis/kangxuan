<template>
    <div>
        <web-view :src="article_url"></web-view>
    </div>
</template>

<script>
export default {
    data(){
        return{
            article_url:""
        }
    },
    mounted() {
        this.article_url = "https://"+this.$mp.query.url
        console.log(this.article_url)


    
    }
}

</script>

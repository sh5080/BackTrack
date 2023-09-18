<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="card-user">
            <div class="author">
              <h4 class="title">메인 페이지</h4>
              <div class="user-info">
                <div class="info-item">
                  <p
                    style="
                      font-size: 3.5em;
                      padding: 0.5em;
                      height: 1em;
                      margin-top: 100px;
                      margin-left: 0px;
                    "
                  >
                    - 우측 하단 채팅 기능을 통해 문의하실 수 있습니다. <br />
                    - 기타 건의 / 문의사항 : prpn97@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-user {
  overflow: hidden;
  width: 2750px;

  height: 2500px;
}
.author {
  margin-top: 20px;
  padding: 50px 100px;
}

.title {
  font-size: 90px;
  margin-bottom: 80px;
  font-weight: 500;
}

.user-info {
  /* border-top: 1px solid #ccc; */
  margin-top: 150px;
  margin-bottom: 100px;
}

.info-item {
  position: relative;
  margin-top: 100px;
  margin-bottom: 10px;
  border-top: 1px solid #ccc;
}

.info-label {
  display: inline-block;
  width: 600px;
  font-size: 75px;
  font-weight: 400;
  margin-top: 70px;
}

.info-value {
  display: inline-block;
  font-size: 70px;
  width: 1250px;
  margin-left: 10px;
}
</style>

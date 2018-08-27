<template>
  <div>
    <header class="header flex">
      <nav class="phone-nav flex" id="phone-nav" @click="_showSidebar">
        <i class="iconfont icon-gengduo"></i>
      </nav>
      <div class="logo flex">
        <img :src="nowconfig.logo" class="logo-class" @click="_toIndex" ref='logo'>
      </div>
      <nav class="pc-nav flex" id="pc-nav">
        <div class="nav-ul flex">
          <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#ff9430">
            <!-- <el-menu-item index="/official">主页</el-menu-item> -->
            <el-menu-item index="/index" v-show="$route.name != 'management'">{{env}}</el-menu-item>
            <el-menu-item index="/order" v-show="user && $route.name != 'management'">我的订单</el-menu-item>
            <!-- <el-menu-item index="/score-record" v-show="user">积分记录</el-menu-item> -->
            <!-- <el-menu-item index="/none/1" v-show="user && !FENZAN" class="disable">
              <div class="log-out" @click="_showPopup($event)">充值积分</div>
            </el-menu-item> -->
            <el-menu-item index="/agent" v-show="user && !FENZAN && $route.name != 'management' && nowconfig.agent_switch" class="disable">
              <div class="log-out" @click="_showAgent($event)">申请代理</div>
            </el-menu-item>
            <el-submenu index="/none/cont1" v-show="user && $route.name != 'management'">
              <template slot="title">我的账户</template>
              <el-menu-item index="/none" class='phone-item disable flex agent-item' v-show="proxyRank && user" disabled>
                <!-- {{proxyRank}} -->
                <div class="agent-ul-warp flex cursor">
                  代理等级: {{proxyRank}}
                  <img :src="proxyIcon" v-if="proxyIcon" class="proxy-icon">
                </div>
                <div class="agent-border-bootom cursor"></div>
              </el-menu-item>
              <el-menu-item index="/none" class='phone-item flex' v-show="user" disabled>
                <div class="agent-ul-li flex cursor">
                  <div class="agent-ul-li-left flex ellipsis">我的账户</div>
                  <div class="agent-ul-li-right flex ellipsis">{{userPhone}}</div>
                </div>
              </el-menu-item>
              <!--               <el-menu-item index="/none" v-show="user.is_agency && user.agency_level && !user.agency.sub_domain && !FENZAN" class='flex' disabled>
                <div class="agent-ul-li flex cursor" @click="_setDomain($event)">
                  <div class="agent-ul-li-left flex ellipsis">创建分站</div>
                  <div class="agent-ul-li-right flex ellipsis"></div>
                </div>
              </el-menu-item>
              <el-menu-item index="/management" v-show="user.agency && user.agency.sub_domain && user.agency.sub_site && !FENZAN" class='flex'>
                <div class="agent-ul-li flex cursor">
                  <div class="agent-ul-li-left flex ellipsis">分站管理</div>
                  <div class="agent-ul-li-right flex ellipsis"></div>
                </div>
              </el-menu-item> -->
              <el-menu-item index="/backstage" v-show="user.is_agency && user.agency && user.agency.level> -1">
                <div class="agent-ul-li flex cursor">
                  <div class="agent-ul-li-left flex ellipsis">代理后台</div>
                  <div class="agent-ul-li-right flex ellipsis"></div>
                </div>
              </el-menu-item>
              <!--              <el-menu-item index="/edit" v-show="false" class='flex'>
                <div class="agent-ul-li flex cursor">
                  <div class="agent-ul-li-left flex ellipsis">分站编辑</div>
                  <div class="agent-ul-li-right flex ellipsis"></div>
                </div>
              </el-menu-item> -->
              <el-menu-item index="/modify-password" v-show="user" class='flex'>
                <div class="agent-ul-li flex cursor">
                  <div class="agent-ul-li-left flex ellipsis">修改密码</div>
                  <div class="agent-ul-li-right flex ellipsis"></div>
                </div>
              </el-menu-item>
              <el-menu-item index="/none" class=' flex' v-show="user" disabled>
                <!-- <div class="log-out-min log-out" @click="_logout($event)">注销</div> -->
                <div class="agent-ul-li flex cursor" @click="_logout($event)">
                  <div class="agent-ul-li-left flex ellipsis">注销</div>
                  <div class="agent-ul-li-right flex ellipsis"></div>
                </div>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="/none/cont2" v-show="user && $route.name == 'management'">
              <template slot="title">我的账户</template>
              <el-menu-item index="/none" class='phone-item disable flex agent-item' v-show="proxyRank && user" disabled>
                <div class="agent-ul-warp flex cursor">
                  代理等级: {{proxyRank}}
                  <img :src="proxyIcon" v-if="proxyIcon" class="proxy-icon">
                </div>
                <div class="agent-border-bootom cursor"></div>
              </el-menu-item>
              <el-menu-item index="/none" class='phone-item flex' v-show="user" disabled>
                <div class="agent-ul-li flex cursor">
                  <div class="agent-ul-li-left flex ellipsis">我的账户</div>
                  <div class="agent-ul-li-right flex ellipsis">{{userPhone}}</div>
                </div>
              </el-menu-item>
              <el-menu-item index="/backstage" v-show="user.is_agency && user.agency && user.agency.level> -1">
                <div class="agent-ul-li flex cursor">
                  <div class="agent-ul-li-left flex ellipsis">代理后台</div>
                  <div class="agent-ul-li-right flex ellipsis"></div>
                </div>
              </el-menu-item>
              <el-menu-item index="/none/zux" class=' flex' v-show="user" disabled>
                <div class="agent-ul-li flex cursor" @click="toZX()">
                  <div class="agent-ul-li-left flex ellipsis">注销</div>
                  <div class="agent-ul-li-right flex ellipsis"></div>
                </div>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/login" v-show="!user">登录帐号</el-menu-item>
          </el-menu>
        </div>
      </nav>
    </header>
    <sidebar ref="sidebar">
      <el-row class="tac">
        <el-col>
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @select="handleSelect" text-color="#000" active-text-color="#ff9430">
            <!-- <el-menu-item index="/official">
              <i class="iconfont icon-tijiaodingdan"></i>主页
            </el-menu-item> -->
            <el-menu-item index="/old-index" v-show="!$root.pageData">
              <i class="iconfont icon-tijiaodingdan"></i>{{env}}
            </el-menu-item>
            <el-menu-item index="/order" v-show="user && !$root.pageData">
              <i class="iconfont icon-unie64a"></i> 我的订单
            </el-menu-item>
            <!--           <el-menu-item index="/score-record" v-show="user">
              <i class="iconfont icon-jilu"></i> 积分记录
            </el-menu-item> -->
            <!--             <el-menu-item index="/none/1" v-show="user" class='disable'>
              <i class="iconfont icon-jifen"></i>
              <div class="log-out" @click="_showPopup($event)">充值积分</div>
            </el-menu-item> -->
            <el-menu-item index="/agent" class='disable' v-show="user && !FENZAN && !$root.pageData && !showDL">
              <i class="iconfont icon-dailishang"></i>
              <div class="log-out" @click="_showAgent($event)">申请代理</div>
            </el-menu-item>
            <el-menu-item index="/backstage" v-show="showDL">
              <i class="iconfont icon-dailishang"></i>
              <div class="log-out">代理后台</div>
            </el-menu-item>
            <el-menu-item index="/recharge" v-show="showDL && $root.pageData === 1">
              <i class="iconfont icon-chongzhi"></i>
              <div class="log-out">充值</div>
            </el-menu-item>
            <el-menu-item index="/reflectforbk" v-show="showDL && $root.pageData === 1">
              <i class="iconfont icon-yuejietixian"></i>
              <div class="log-out">提现</div>
            </el-menu-item>
            <el-menu-item index="/none/management" v-show="showDL && $root.pageData" class='disable'>
              <i class="iconfont icon-icon-test"></i>
              <div class="log-out" @click="_emit('headerToDl','/management')">分站管理</div>
            </el-menu-item>
            <el-menu-item index="/bg-task-record" v-show="showDL && $root.pageData === 1">
              <i class="iconfont icon-renwu"></i>
              <div class="log-out">任务列表</div>
            </el-menu-item>
            <el-menu-item index="/bg-money-record" v-show="showDL && $root.pageData === 1">
              <i class="iconfont icon-1"></i>
              <div class="log-out">充值记录</div>
            </el-menu-item>
            <el-menu-item index="/goodsManage" v-show="showDL && $root.pageData === 2">
              <i class="iconfont icon-shangpin"></i>
              <div class="log-out">商品管理</div>
            </el-menu-item>
            <el-menu-item index="/task" v-show="showDL && $root.pageData === 2">
              <i class="iconfont icon-jilu"></i>
              <div class="log-out">分站任务</div>
            </el-menu-item>
            <el-menu-item index="/none/kefu" v-show="showDL && $root.pageData === 1" class='disable'>
              <i class="iconfont icon-kefu"></i>
              <div class="log-out" @click="_emit('openqq',false)">客服帮助</div>
            </el-menu-item>
            <el-menu-item index="/none/fapiao" v-show="showDL && $root.pageData === 1" class='disable'>
              <i class="iconfont icon-fapiao"></i>
              <div class="log-out" @click="_emit('openqq',false)">发票申请</div>
            </el-menu-item>
            <el-submenu v-show="user" index="5">
              <template slot="title">
                <i class="iconfont icon-zhanghu"></i> 我的账户
              </template>
              <el-menu-item index="/none" class='phone-item disable' v-show="proxyRank">{{proxyRank}}</el-menu-item>
              <el-menu-item index="/none" class='phone-item disable'>{{userPhone}}</el-menu-item>
              <el-menu-item index="/none" class='phone-item disable' v-if="showDL && $root.pageData">我的余额：{{user.score}}</el-menu-item>
              <el-menu-item index="/none" class='phone-item disable' v-if="showDL && $root.pageData">分站营业额：{{user.agency.balance}}</el-menu-item>
              <el-menu-item index="/modify-password">修改密码</el-menu-item>
              <el-menu-item index="/none" class='disable'>
                <div class="log-out log-out-min" @click="_logout($event)">注销</div>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/login" v-show="!user">
              <i class="iconfont icon-msnui-user"></i> 登录帐号
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </sidebar>
    <interlayer ref="interlayer" @close='_interlayerHide'></interlayer>
    <popup ref="popup">
      <div class="recharge-box">
        <div class="recharge-box-title flex" v-show="!payUrl">{{BuyDomainData ? '订单确认' : '积分充值'}}</div>
        <div class="recharge-box-title flex" v-show="payUrl">{{payType}}扫码支付</div>
        <div class="content-qr flex" v-if="payUrl">
          <div class="cq-left flex"><img :src="'http://p70pqu6ys.bkt.clouddn.com/'+ activePayType +'.png'" alt="支付方式" class="cq-pay-img"></div>
          <div class="cq-right flex">
            <div class="code-div flex">订单编号:{{code}} 充值金额: <span class="my-money" v-show='!BuyDomainData'>{{money||choseGood.price}}</span><span class="my-money" v-if='BuyDomainData'>{{BuyDomainData.price}}</span>元
            </div>
            <div class="qrcode-box flex">
              <img ref="payImg">
            </div>
            <div class="showWX flex">{{wxPayTips ? wxPayTips : '请用' + payType + '扫描二维码支付'}}</div>
          </div>
          <div class="recharge-btn-box-after flex">
            <div class="recharge-btn-sure-after flex sure cursor" @click="_sureCompletionPayment">确定已完成支付</div>
            <div class="recharge-btn-sure-after flex cancel cursor" @click="_hiddenSidebar">我再考虑考虑</div>
            <!-- <div class="colseBtn flex" @click="_hiddenSidebar">我再考虑考虑</div> -->
          </div>
        </div>
        <!--         <div class="goods-box flex" v-show="!payUrl  && app && app.goods.length > 0 && !BuyDomainData">
          <div v-for="item in app.goods" :class="{'active-good': choseGoodId === item.id && !money}" @click="_choseGood(item.id)" class="good-item cursor flex">
            <div class="good-item-label flex ellipsis">{{item.label}}</div>
            <div class="good-item-label flex ellipsis">{{'￥'+parseInt(item.price)}}</div>
          </div>
        </div> -->
        <!-- app  商品  end -->
        <!-- <div class="net-item flex" v-show="!payUrl">微信支付</div> -->
        <!-- <img src="../../assets/weixin.jpg" v-show="!payUrl" class="pay-img"> -->
        <div class="flex input-defult width90" v-show="!payUrl && !BuyDomainData">
          <!-- onkeyup="value=value.replace(/[^\d]/g,'') " ng-pattern="/[^a-zA-Z]/" -->
          <input type="text" :placeholder="'请输入充值金额（元）'" class="i-ipnput" v-model="money" ref='input' @keyup="_rectifyMoney" @focus='_inputFocus' @blur='_inputBlur' :class="{'inputFocus' : inputFocus}" @keyup.enter="_addOrder" autocomplete='off' autofocus='on'>
        </div>
        <div class="min-tips-text flex" v-show="!payUrl&&((money&& money>=Math.ceil(app.min_recharge)) || choseGood) && !BuyDomainData">充值<span class="my-money">{{money|| choseGood.price}}</span>元等于<span class="course-btn">{{Math.ceil(money*scorerate) || choseGood.score}}</span>积分</div>
        <div class="min-tips-text flex" v-show="!payUrl&&(!money || money<Math.ceil(app.min_recharge)) && !choseGood && !BuyDomainData">最小充值金额为<span class="my-money">{{Math.ceil(app.min_recharge)}}</span>元。</div>
        <div class="buy-domain-data" v-if="BuyDomainData && !payUrl">
          <div class="bdd-item flex">
            <div class="bdd-item-left flex ellipsis">提交信息</div>
            <div class="bdd-item-right flex ellipsis cursor bdd-item-right-url" @click="_openUrl(BuyDomainData.addition)">{{BuyDomainData.addition}}</div>
          </div>
          <div class="bdd-item flex">
            <div class="bdd-item-left flex ellipsis">订单详情</div>
            <div class="bdd-item-right flex ellipsis">{{BuyDomainData.services.label}} * {{BuyDomainData.point}}{{BuyDomainData.services.units||'次'}} = {{BuyDomainData.price}} 元</div>
          </div>
          <!--           {{BuyDomainData.addition}}
            {{BuyDomainData.price}} -->
        </div>
        <!-- app  支付方式 -->
        <div class="goods-box flex" v-show="!payUrl">
          <div v-for="(value, key) in app.payments" @click="_chosePayType(key, value)" :class="{'active-pay-type':activePayType === key, 'disable-pay-type' : !value}" class="cursor flex pay-item ellipsis" v-if='value'>
            <img :src="'http://ozp5yj4ke.bkt.clouddn.com/'+ key + '.png'" class="pay-icon"> {{key === 'wx' ? '微信支付':key === 'qq'?'QQ支付':'支付宝支付'}}</div>
        </div>
        <!-- app  支付方式  end -->
        <div class="recharge-btn-box flex" v-show="!payUrl">
          <div class="recharge-btn-sure flex sure cursor" @click="_addOrder" v-if="!BuyDomainData">确认</div>
          <div class="recharge-btn-sure flex sure cursor" @click="_addSubSiteTask" v-if="BuyDomainData">确定</div>
          <div class="recharge-btn-sure flex cancel cursor" @click='_hiddenSidebar'>取消</div>
        </div>
      </div>
    </popup>
    <!-- 2018.04.21-申请代理 -->
    <popup ref='agent' :protocol='true'>
      <div v-show='!hadAgree'>
        <div class="recharge-box-title-agent flex">代理合作协议</div>
        <div class="agreement-content">
          <p>尊敬的用户您好，感谢您使用“星空网红助手平台”网站及相关服务！ 根据《中华人民共和国合同法》及相关法律法规的规定，用户和星空网红助手平台（以下简称我平台）双方本着自愿、平等、诚信的原则，就用户购买星空网红助手平台相关服务及有关事宜达成如下条款:</p>
          <div class="agreement-content-title flex">第一条 代理服务内容</div>
          <p>1、我平台同意该用户代理销售相关互联网在线服务，我平台将全力支持配合用户的销售行为。</p>
          <p> 2、用户的具体可销售服务内容和产品价格，以网站当前实际报价为准。</p>
          <div class="agreement-content-title flex">第二条 代理费用及支付</div>
          <p>1、用户需缴纳代理费用方可成为我平台代理，获取代理服务销售价格和相关支持。代理费用为年费，仅为一年的使用费用。</p>
          <p>2、我平台给用户提供的服务费用，采取预付费的形式进行结算，以用户使用服务等功能的实际价格进行收取。</p>
          <p>3、用户的实际购买价格折扣，根据用户的代理等级有不同折扣，实际折扣以当前实际情况为准。</p>
          <div class="agreement-content-title flex">第三条 用户的权利及义务</div>
          <p>1、用户按本协议约定享有我平台产品服务的使用权、产品升级服务及客户服务。</p>
          <p>2、用户购买我平台产品服务，应按本协议的约定按时向我平台支付相应的服务费用。</p>
          <p>3、用户必须遵守国家有关法律、法规的规定，不得利用我平台服务从事国家法律法规所禁止的活动，并对利用我平台服务使用行为及数据内容的合法性承担完全责任。</p>
          <p>4、如我平台服务与本协议约定及官方公布的条款或内容不符，用户有权单方提前终止我平台服务的使用，并可申请退还截至终止之日至尚未抵扣的费用。</p>
          <div class="agreement-content-title flex">第四条 “星空网红助手平台”的权利及义务 </div>
          <p>1、我平台按本协议约定向用户提供技术服务及本协议约定的产品升级服务。</p>
          <p> 2、我平台将持续对我平台的服务平台提供升级服务，包括且不限于：功能优化、功能新增、第三方集成插件等功能和服务，相关升级服务将会以协议约定的电话、邮件或提前在我平台网站显著位置公示等有效方式通知用户。 </p>
          <p>3、我平台将基于我平台服务质量提升的考虑，可能调整或优化服务内容或服务方式，所有调整或优化的服务内容和服务方式将会以协议约定的电话、邮件或提前在我平台网站显著位置公示等有效的方式通知用户。</p>
          <p>4、我平台服务平台在协议约定版本内的我平台自行开发或拥有知识产权的功能优化、功能新增等升级服务将免费为用户提供。</p>
          <p>5、我平台对用户使用我平台服务的数据实行 7*24 小时技术支持。如果发现用户出现非法行为，我平台有权冻结用户账号直至用户查清停止非法行为为止，同时用户应积极配合自查非法行为，将信息准确提供给我平台以备国家相关监管部门审查。 </p>
          <div class="agreement-content-title flex">第五条 费用续费和协议延续</div>
          <p>1、用户需在其已经确认的订单的服务期满前 30 日内确认是否续费，用户已支付的订单服务期满且未在 30 日内完成续费订单确认及费用支付的，我平台有权在用户确认的订单服务期满后中止向用户服务，但我平台产品服务平台会将用户账号中的数据自到期之日起保存30 天，此期间称为保留期。 </p>
          <p>2、如用户在保留期内完成续费订单确认及费用支付的，我平台将恢复用户的服务及账号中的数据，在保留期内未及时完成续费订单确认及费用支付的，我平台将在保留期结束后不再保存用户账号中的数据，由此造成的一切后果由用户自行承担。 </p>
          <p>3、保留期满后用户仍未完成续费订单确认及费用支付的，本协议自动终止。如用户仍有预付款未抵扣的，视为用户放弃上述预付款 </p>
          <div class="agreement-content-title flex">第六条 保密条款 </div>
          <p>1、保密信息指双方合作过程中由披露方向接收方披露的所有保密信息，包括但不限于商业计划、客户信息、服务协议、技术数据、产品构思、产品价格、职员名单、操作手册等。</p>
          <p>2、保密信息还包括用户使用我平台产生的数据及相关内容，以及涉及我平台与本协议有关的所有信息，包括但不限于我平台的服务内容、优惠费率等。 </p>
          <p>3、用户和我平台双方不得将保密信息向第三方或者公众透露，否则承担由此给保密信息所有方造成的一切损失。 </p>
          <p>4、保密责任不因本协议的终止而终止。 </p>
          <div class="agreement-content-title flex">第七条 知识产权 </div>
          <p>1、 我平台完全拥有我平台服务及产品的全部知识产权（包括但不限于版权、商标权、专利权及商业秘密等），用户签署本协议后并未拥有产品的所有权。我平台的名字、标志、LOGO、产品名字等属于我平台，未经我平台授权，其他方不得使用。 </p>
          <p>2、用户完全拥有在使用我平台服务过程中产生的数据及相关内容的所有权，除法律允许的情况下，我平台不得使用用户的文件数据及相关内容。 </p>
          <div class="agreement-content-title flex">第八条 不可抗力 </div>
          <p>1、因不可抗力事件，致使一方无法履行本协议，发生不可抗力的一方有权提前终止本协议，在不可抗力的影响范围内得以免除责任，但应在上述情况发生后 5 个工作日内书面通知并提供有效证明。</p>
          <p>2、不可抗力事件包括但不限于：国家政策调整、机房中继线路调整、电信运营商机房维护检修、网络互联互通链接不通畅、电信运营商政策调整与影响。</p>
          <p>3、鉴于我平台为基于互联网应用的产品服务平台的特殊性，因黑客、病毒、电信部门技术调整等引起的事件，用户亦认同不属于我平台违约。但我平台应尽最大努力保护用户权益并在事件结束后立即恢复服务。</p>
          <div class="agreement-content-title flex">第九条 违约责任 </div>
          <p> 1、违约金条款适用于正式的付费服务周期。</p>
          <p> 2、除本协议另有约定外，任何一方违反本协议而使另一方发生任何费用或开支或额外责任或遭受损失的，违约方应在收到非违约方书面通知之日起十个工作日内就该费用、开支、责任或损失，给予非违约方赔偿。 </p>
          <p>3、如用户违反本协议及附件相关约定，我平台有权提前解除服务协议，并不退还用户所支付的服务费用；如给我平台造成损失的，用户应当赔偿我平台实际发生的损失。</p>
          <p>4、如我平台所提供的服务和本协议及附件相关约定不符，用户有权提前解除协议，我平台退还用户所支付的服务费用</p>
          <div class="agreement-content-title flex">第十条 争议及解决 </div>
          <p>用户及我平台就本协议的任何争议须友好协商。如协商不成，用户及我平台均可向被告方所在地人民法院起诉。本协议之签署、效力、解释和执行以及本协议项下争议之解决均应适用中国法律</p>
          <div class="agreement-content-title flex">第十一条 其他 </div>
          <p>本协议的版权为我平台所有，我平台保留一切解释和修改的权利，并在修改后通知用户。</p>
          <p class="font-weight-agent">对于以上《代理合作协议》的各项内容，用户已全文阅读并完全理解。</p>
        </div>
        <div class="recharge-btn-box-after flex bottom">
          <div class="recharge-btn-sure-after flex sure-agent cursor" @click='_agree'>同意并继续</div>
          <div class="recharge-btn-sure-after flex cancel cursor" @click="_hiddenAgent">我再考虑考虑</div>
        </div>
      </div>
      <div v-show='hadAgree'>
        <div class="recharge-box-title-agent flex">提交代理申请</div>
        <div class="agreement-content overHiden">
          <div class="flex agree-input-box">
            <div class="agree-label flex ellipsis">公司简称<span class="must">*</span></div>
            <div class="flex input-defult">
              <input type="text" placeholder="请填写公司简称" class="i-ipnput" v-model="companyName">
            </div>
          </div>
          <div class="flex agree-input-box">
            <div class="agree-label flex ellipsis">申请人<span class="must">*</span></div>
            <div class="flex input-defult">
              <input type="text" placeholder="请填写申请人" class="i-ipnput" v-model="applicant">
            </div>
          </div>
          <div class="flex agree-input-box">
            <div class="agree-label flex ellipsis">联系电话<span class="must">*</span></div>
            <div class="flex input-defult">
              <input type="text" placeholder="请填写联系电话" class="i-ipnput" v-model="telephone">
            </div>
          </div>
          <div class="flex agree-input-box">
            <div class="agree-label flex ellipsis">电子邮箱<span class="must">*</span></div>
            <div class="flex input-defult">
              <input type="text" placeholder="请填写电子邮箱" class="i-ipnput" v-model="mailBox">
            </div>
          </div>
          <div class="flex agree-input-box">
            <div class="agree-label flex ellipsis">申请需求<span class="not-must">(非必填)</span></div>
            <div class="flex input-defult">
              <input type="text" placeholder="请简要描述您的需求" class="i-ipnput" v-model="demand">
            </div>
          </div>
        </div>
        <div class="recharge-btn-box-after flex bottom">
          <div class="recharge-btn-sure-after flex sure-agent cursor" @click="_sublimeAgree">提交申请</div>
          <div class="recharge-btn-sure-after flex cancel cursor" @click="_hiddenAgent">我再考虑考虑</div>
        </div>
      </div>
    </popup>
    <el-dialog :title="dialogTitle" :visible.sync="centerDialogVisible" width="30vw" center :show-close="false" top="35vh">
      <div class="dialog-min-text flex">{{dialogText}}</div>
      <div class="flex dialog-btn-box">
        <!-- <div class="dialog-min-btn flex cursor ellipsis" @click="centerDialogVisible = false">取消</div> -->
        <div class="dialog-min-btn flex cursor ellipsis" @click="_toDL()">现在去代理后台</div>
      </div>
    </el-dialog>
    <popup ref='domain'>
      <div>
        <div class="recharge-box-title-agent flex">设置您分站域名</div>
        <div class="rbta-input-warp flex">
          <input type="text" name="domain" class="rbata-iw-left flex" placeholder="填写您的域名" v-model="domainText" @input="_changeExists">
          <div class="rbata-iw-right flex">.xkfans.com</div>
          <div class="rbata-iw-right flex rbta-btn cursor" @click="_checkDomain">检查</div>
        </div>
        <div class="titps-domain flex" v-show="exists === 1">温馨提示:设置完成后您可以通过{{domainText}}.xkfans.com访问您的分站</div>
        <div class="titps-domain flex sucess-domain" v-show="exists === 2">此网址{{domainText}}.xkfans.com可以被使用</div>
        <div class="titps-domain flex fail-domain" v-show="exists === 3">此网址{{domainText}}.xkfans.com已经被使用</div>
        <!-- #FF9100 -->
        <div class="recharge-btn-box-after flex bottom">
          <div class="recharge-btn-sure-after flex sure-agent cursor" @click="_setDomainSure">确定</div>
          <div class="recharge-btn-sure-after flex cancel cursor" @click="_hiddenDomain">取消</div>
        </div>
      </div>
    </popup>
    <el-dialog :visible.sync="dialogTableVisible" style="margin-top: -14vh">
      <div class="dl-explain-warp">
        <img src="http://p70pqu6ys.bkt.clouddn.com/%E4%BB%A3%E7%90%86%E7%89%B9%E6%9D%83%E8%AF%B4%E6%98%8E.png" alt="代理简易说明" class="dl-explain-img">
        <div class="dl-agencylevel flex">
          <div v-for="item in agencyLevel" v-show="item.level>0" class="dl-aglevel-item flex">{{Math.ceil(item.money)}}元</div>
        </div>
      </div>
    </el-dialog>
    <a id='links' href="#" style='display:none;'></a>
    <iframe :src="payUrl" v-if="payUrl && ifreamPayurl" class="pay-iframe" seamless></iframe>
  </div>
</template>
<script type="text/javascript">
import { setDomain, setSiteinfo, subDomains, getAgencyLevel } from 'api/site'
import { getOrders } from 'api/score-record'
import sidebar from 'components/sidebar/sidebar'
import { mapGetters, mapMutations } from 'vuex'
import interlayer from 'base/interlayer/interlayer'
import popup from 'base/popup/popup'
import { addOrder, agency } from 'api/header'
import { testToken, isPhone, compare, isWx } from 'common/js/util'
// import QrcodeVue from 'qrcode.vue'
import QRCode from 'qrcode'
import { getUserInfo, addSubSiteTask, addSiteTask } from 'api/index'
import { SUCCESS_CODE } from 'api/config'
import { UAID } from 'api/config'
import { NOWCONFIG } from 'api/appConfig'
export default {
  data() {
    return {
      BuyDomainData: null,
      nowconfig: null,
      uaid: null,
      sidebar: null,
      popup: null,
      agent: null,
      payUrl: null,
      size: 120,
      code: null,
      FENZAN: null,
      choseGoodId: -1,
      inputFocus: true,
      activePayType: null,
      env: '网红打造',
      time: null,
      hadAgree: null,
      centerDialogVisible: null,
      exists: 1,
      dialogText: '',
      dialogTitle: '',
      money: '',
      companyName: '',
      applicant: '',
      telephone: '',
      mailBox: '',
      demand: '',
      domainText: '',
      _timeforSPS: null,
      timeforCumt: 0,
      ifreamPayurl: null,
      newPage: null,
      dialogTableVisible: null,
      agencyLevel: null,
      wxPayTips: null,
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      iconList: ['http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E8%AE%B01.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A72.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A73@2x.png']
    }
  },
  created() {
    this.uaid = UAID
    this.nowconfig = NOWCONFIG
    this._headerInit()
    this.$root.eventHub.$on('user', (location) => {
      this._updataUser(location)
    })
    this.$root.eventHub.$on('agent', () => {
      this._toShowAgent()
    })
    this.$root.eventHub.$on('env', () => {
      this.env = '测试环境'
    })
    this.$root.eventHub.$on('showPopup', (data) => {
      this._showPopup(false, data)
    })
    this.$root.eventHub.$on('domain', () => {
      this._setDomain()
    })
    this.$root.eventHub.$on('dialogTableVisible', () => {
      this.dialogTableVisible = true
    })
    this.$root.eventHub.$on('logo', (src) => {
      this._setLogo(src)
      this._FENZAN()
    })
    this.$root.eventHub.$emit('canvas')
    // this._getAppInfo(this)
    this.telephone = this.user.phone || ''
    // this.choseGoodId = this.app.goods[0].id || -1
    this.activePayType = 'wx'
    if (isWx()) {
      this.wxPayTips = '请长按识别二维码唤起支付'
    }
  },
  computed: {
    showDL() {
      return this.user.is_agency && this.user.agency && this.user.agency.level > -1
    },
    choseGood() {
      if (this.choseGoodId > -1) {
        let ret = false
        for (let i = 0; i < this.app.goods.length; i++) {
          if (this.app.goods[i].id === this.choseGoodId) {
            ret = this.app.goods[i]
            break
          }
        }
        return ret
      } else {
        return false
      }
    },
    payType() {
      return this.activePayType === 'wx' ? '微信' : this.activePayType === 'ali' ? '支付宝' : this.activePayType === 'qq' ? '腾讯' : this.activePayType
    },
    proxyRank() {
      if (this.user && this.user.agency && this.user.agency.level > 0) {
        return this.rank[this.user.agency.level - 1]
      } else {
        return '普通用户'
      }
    },
    proxyIcon() {
      if (this.user && this.user.agency && this.user.agency.level > 0) {
        return this.iconList[this.user.agency.level - 1]
      } else {
        return false
      }
    },
    userPhone() {
      if (this.user) {
        return this._formatUserPhone(this.user.phone)
      } else {
        return '未登录'
      }
    },
    ...mapGetters([
      'user',
      'token',
      'scorerate',
      'tokenTime',
      'app'
    ])
  },
  methods: {
    _headerInit() {
      getAgencyLevel().then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.agencyLevel = this._sortAL(res.data.data, 'level')
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _sortAL(list, value) {
      return list.sort(compare(value))
    },
    _toDL() {
      this.centerDialogVisible = false
      this.$router.replace({
        path: '/backstage'
      })
    },
    _emit(name, info) {
      if (this.sidebar) {
        this._hiddenSidebar()
      }
      this.$root.eventHub.$emit(name, info)
    },
    toZX() {
      this.setUser(false)
      this.setToken(false)
      this.setTokenTime(false)
      window.location.href = NOWCONFIG.seo + '/loginout'
    },
    _changeExists() {
      if (this.exists === 1) {
        return
      }
      this.exists = 1
    },
    _addSubSiteTask() {
      if (!this.activePayType) {
        this.$parent._open('请选择支付方式')
        return
      }
      if (!this.checkTock()) {
        return false
      }
      this.BuyDomainData.pay_type = this.activePayType
      if (isPhone() && !isWx()) {
        this.newPage = window.open('about:blank', "_blank")
      }
      addSiteTask(this.token, this.BuyDomainData).then((res) => {
        this._afterAddOrder(res)
      })
    },
    _FENZAN() {
      this.FENZAN = true
    },
    _setLogo(src) {
      // console.log(src)
      this.$refs.logo.src = src
    },
    _setDomainSure() {
      if (!this.domainText) {
        this.$parent._open('请填写域名')
        return false
      }
      if (!this.checkTock()) {
        return false
      }
      let domain = this.domainText + '.xkfans.com'
      setDomain(this.token, domain).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.$parent._open('设置成功')
          this.$root.eventHub.$emit('user')
          this._hiddenDomain()
          this._setMySite()
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _setMySite() {
      const logoUrl = 'http://p8sxtcg6t.bkt.clouddn.com/defual.png'
      const siteName = '分站名称'
      const siteFix = '分站名称后缀'
      const siteAnnouncement = '分站公告，请到分站管理后台编辑'
      const sitFooter = 'fans10005'
      const sitFooterEmail = '32721755455'
      setSiteinfo(this.token, logoUrl, siteName, siteFix, siteAnnouncement, sitFooter, sitFooterEmail).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.$root.eventHub.$emit('user', 'management')
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _checkDomain() {
      if (!this.domainText) {
        this.$parent._open('请填写域名')
        return false
      }
      let domain = this.domainText + '.xkfans.com'
      subDomains(domain).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          console.log(res.data.data.exists)
          if (res.data.data.exists) {
            this.exists = 3
          } else {
            this.exists = 2
          }
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _setDomain(e) {
      if (e) {
        e.stopPropagation()
      }
      this.$nextTick(() => {
        this.domain = true
        this.$refs.domain._showPopup()
        this.$refs.interlayer._setZIndex(9999)
        this.$refs.interlayer._showLayer()
        // if (this.$refs.input) {
        //   this.$refs.input.focus()
        // }
      })
    },
    _hiddenDomain() {
      if (this.domain && !this.sidebar) {
        this.domain = false
        this.$refs.domain._hiddenPopup()
        this.$refs.interlayer._hiddenLayer()
      }
      if (this.domain && this.sidebar) {
        this.domain = false
        this.$refs.domain._hiddenPopup()
        this.$refs.interlayer._setZIndex(1500)
      }
    },
    // _interlayer(value) {
    //   if (value) {
    //     this.$refs.interlayer._showLayer()
    //   } else {
    //     this.$refs.interlayer._hiddenLayer()
    //   }
    // },
    _formatUserPhone(phone) {
      const start = phone.slice(0, 3)
      const end = phone.slice(-4)
      return start + '****' + end
    },
    _sublimeAgree() {
      if (!this.companyName) {
        this.$parent._open('请填写公司简称')
        return false
      }
      if (!this.applicant) {
        this.$parent._open('请填写申请人')
        return false
      }
      if (!this.telephone) {
        this.$parent._open('请填写联系电话')
        return false
      }
      if (!this._checkPhone(this.telephone)) {
        this.$parent._open('请正确填写联系电话')
        return false
      }
      if (!this.mailBox) {
        this.$parent._open('请填写您的电子邮箱')
        return false
      }
      if (!this._checkMail(this.mailBox)) {
        this.$parent._open('请正确填写您的电子邮箱')
        return false
      }
      if (!testToken(this.tokenTime)) {
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
        this.$parent._open('登录已失效')
        this.$router.replace({
          path: '/login'
        })
        this._hiddenAgent()
        return false
      }
      agency(this.token, this.companyName, this.applicant, this.telephone, this.mailBox, this.demand).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.companyName = ''
          this.$root.eventHub.$emit('user')
          this.dialogTitle = '你的代理申请已成功提交！'
          this.dialogText = "现在您可以通过我的账户中代理后台按钮进入后台"
          this.centerDialogVisible = true
          this._hiddenAgent()
        } else {
          if (res.data.err_msg) {
            this.telephone = ''
            this.mailBox = ''
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.telephone = ''
            this.mailBox = ''
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _checkMail(mail) {
      let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      if (filter.test(mail)) {
        return true
      } else {
        return false
      }
    },
    _checkPhone(phone) {
      let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}|(19[0-9]{1})))+\d{8})$/
      if (myreg.test(phone)) {
        return true
      } else {
        return false
      }
    },
    _agree() {
      this.hadAgree = true
    },
    _countdown() {
      if (!this.time) {
        this.time = 0
      }
      this.timer = setInterval(() => {
        if (this.time > 1) {
          this.time = this.time - 1
        } else {
          this.time = '同意并继续'
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },
    _daili(e) {
      if (e) {
        e.stopPropagation()
      }
      this.$parent._open('近期将开放代理申请')
    },
    _inputFocus() {
      if (!this.inputFocus) {
        this.inputFocus = true
      }
    },
    _inputBlur() {
      if (this.inputFocus) {
        this.inputFocus = false
      }
    },
    _chosePayType(key, value) {
      if (value && this.activePayType !== key) {
        this.activePayType = key
      }
    },
    _choseGood(id) {
      this.choseGoodId = id
      this.money = ''
    },
    _rectifyMoney() {
      if (isNaN(this.money)) {
        this.money = ''
      }
      if (this.choseGoodId && this.money) {
        this.choseGoodId = -1
      }
      if (this.money.indexOf('.') > -1) {
        const end = this.money.indexOf('.')
        this.money = this.money.slice(0, end + 3)
      }
    },
    checkTock() {
      if (!this.user && !this.token) {
        this.$parent._open('请登录')
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      if (!testToken(this.tokenTime)) {
        // console.log('登录已失效 checkTock')
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
        this.$parent._open('登录已失效')
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      return true
    },
    _updataUser(location) {
      if (!this.checkTock()) {
        return false
      }
      this.money = ''
      getUserInfo(this.token).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.setUser(res.data.data)
          if (location) {
            this.$router.replace({
              path: location
            })
          }
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _addOrder() {
      if (!this.activePayType) {
        this.$parent._open('请选择支付方式')
        return
      }
      // this.newPage = window.open()
      if (this.choseGoodId >= 0 && this.choseGood && this.activePayType) {
        addOrder(this.token, this.choseGood.score, this.activePayType, this.choseGood.price, this.choseGood.id).then((res) => {
          this._afterAddOrder(res)
        })
      } else {
        if (!isNaN(this.money)) {
          if (!testToken(this.tokenTime)) {
            this.setUser(false)
            this.setToken(false)
            this.setTokenTime(false)
            this.$parent._open('登录已失效')
            this.$router.replace({
              path: '/login'
            })
            this._hiddenSidebar()
            return false
          }
          if (!this.scorerate) {
            // this._getAppInfo()
            this.$parent._open('网络错误，请刷新后重试')
            this._hiddenSidebar()
            return
          }
          if (this.money < Math.ceil(this.app.min_recharge)) {
            this.$parent._open(`最小充值${Math.ceil(this.app.min_recharge)}元`)
            return
          }
          if (!this.activePayType) {
            this.$parent._open('请选择支付方式')
            return
          }
          addOrder(this.token, Math.ceil(this.scorerate * this.money), this.activePayType, this.money).then((res) => {
            this._afterAddOrder(res)
          })
        } else {
          this.$parent._open('请输入数字')
        }
      }
    },
    _afterAddOrder(res) {
      if (res.data.err_code === SUCCESS_CODE) {
        // new QRCode(document.getElementById("qrcode"), res.data.data.pay_url)
        this.code = res.data.data.code
        this.payUrl = res.data.data.pay_url
        if (isPhone() && !isWx()) {
          this.newPage.location.href = this.payUrl
        }
        const opts = {
          type: 'image/jpeg'
        }
        QRCode.toDataURL(this.payUrl, opts)
          .then(url => {
            this.$refs.payImg.src = url
          })
          .catch(err => {
            console.error(err)
          })
        this.timeforCumt = 0
        this._timeforSPS = setInterval(() => {
          this._surePaySuc(this.code)
          this.timeforCumt++
            if (this.timeforCumt >= 70) {
              this._clearTimeforSPS()
            }
        }, 3000)
      } else {
        this._hiddenSidebar()
        this.money = ''
        if (res.data.err_msg) {
          this.$parent._open(this.$root.errorCode[res.data.err_code])
        } else {
          this.$parent._open('似乎出错了')
        }
      }
    },
    _surePaySuc(code) {
      if (!this._timeforSPS) {
        return false
      } else {
        getOrders(this.token, 11, 0, code).then((res) => {
          if (res.data.err_code === SUCCESS_CODE) {
            if (res.data.data.data[0] && res.data.data.data[0].status == 2) {
              this.payUrl = null
              this.ifreamPayurl = null
              this.$parent._open('支付成功！')
              this._clearTimeforSPS()
              this._sureCompletionPayment()
            }
          }
        })
      }
    },
    _clearTimeforSPS() {
      clearInterval(this._timeforSPS)
      this.ifreamPayurl = null
      this._timeforSPS = null
      this.timeforCumt = 0
    },
    _sureCompletionPayment() {
      this._hiddenSidebar()
      this.$router.replace({
        path: '/order'
      })
      this.$root.eventHub.$emit('canvas', true)
    },
    _logout(e) {
      e.stopPropagation()
      this.setUser(false)
      this.setToken(false)
      this.setTokenTime(false)
      this.$parent._open('已注销')
      this.$router.replace({
        path: '/login'
      })
      if (this.sidebar) {
        this._hiddenSidebar()
      }
      this.$root.eventHub.$emit('canvas', true)
    },
    _toIndex() {
      if (this.nowconfig.seo) {
        // window.location.href = this.nowconfig.seo
        window.open(this.nowconfig.seo)
      } else {
        this.$root.eventHub.$emit('updateOrder')
        this.$root.eventHub.$emit('user')
        this.$root.eventHub.$emit('updateScoreRecord')
        this.$router.replace({
          path: '/index'
        })
        this.$root.eventHub.$emit('canvas', true)
      }
      // this.$root.eventHub.$emit('updateOrder')
      // this.$root.eventHub.$emit('user')
      // this.$root.eventHub.$emit('updateScoreRecord')
      // this.$router.replace({
      //   path: '/index'
      // })
      // this.$root.eventHub.$emit('canvas', true)
    },
    _buy() {
      // console.log('buy')
    },
    _showSidebar() {
      this.sidebar = true
      this.$nextTick(() => {
        this.$refs.sidebar._showSidebar()
        this.$refs.interlayer._setZIndex(1500)
        this.$refs.interlayer._showLayer()
      })
    },
    _showPopup(e, data) {
      if (e) {
        e.stopPropagation()
      }
      if (data) {
        this.BuyDomainData = data
      }
      if (this.BuyDomainData.pay_type) {
        this.activePayType = this.BuyDomainData.pay_type
        this._addSubSiteTask()
      }
      this.$nextTick(() => {
        this.popup = true
        this.$refs.popup._showPopup()
        this.$refs.interlayer._setZIndex(9999)
        this.$refs.interlayer._showLayer()
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
      })
    },
    _showAgent(e) {
      this.$router.replace({
        path: '/agent'
      })
    },
    _toShowAgent() {
      if (this.user.is_agency) {
        this.dialogTitle = '您已提交过申请'
        this.dialogText = '您已提交过申请，无需重复申请'
        this.centerDialogVisible = true
        return false
      }
      this.$nextTick(() => {
        this.agent = true
        this.$refs.agent._showPopup()
        this.$refs.interlayer._setZIndex(9999)
        this.$refs.interlayer._showLayer()
      })
    },
    _hiddenAgent() {
      clearInterval(this.timer)
      this.timer = null
      this.time = false
      this.hadAgree = false
      if (this.agent && !this.sidebar) {
        this.agent = false
        this.$refs.agent._hiddenPopup()
        this.$refs.interlayer._hiddenLayer()
      }
      if (this.agent && this.sidebar) {
        this.agent = false
        this.$refs.agent._hiddenPopup()
        this.$refs.interlayer._setZIndex(1500)
      }
    },
    _openUrl(e) {
      if (e.indexOf('http') > -1) {
        window.open(e)
      }
    },
    _hiddenSidebar() {
      if (this._timeforSPS) {
        this._clearTimeforSPS()
      }
      if (this.payUrl) {
        this.$root.eventHub.$emit('user')
        this.$root.eventHub.$emit('updateOrder')
      }
      this.payUrl = false
      if (this.sidebar && !this.popup) {
        this.sidebar = false
        this.$refs.sidebar._hiddenSidebar()
        this.$refs.interlayer._hiddenLayer()
      }
      if (this.popup && !this.sidebar) {
        this.popup = false
        this.$refs.popup._hiddenPopup()
        this.$refs.interlayer._hiddenLayer()
      }
      if (this.popup && this.sidebar) {
        this.popup = false
        this.$refs.popup._hiddenPopup()
        this.$refs.interlayer._setZIndex(1500)
      }
    },
    _interlayerHide() {
      if (this.sidebar && !this.popup) {
        this.sidebar = false
        this.$refs.sidebar._hiddenSidebar()
        this.$refs.interlayer._hiddenLayer()
      }
      // this.$root.eventHub.$emit('closeCourse')
    },
    handleSelect(key, keyPath) {
      this.$root.eventHub.$emit('canvas')
      if (this._timeforSPS) {
        this._clearTimeforSPS()
      }
      if (key.indexOf('/none') > -1) {
        return false
      }
      if (this.sidebar) {
        this._hiddenSidebar()
      }
      if (key === this.$route.path) {
        return
      }
      this.$router.replace({
        path: key
      })
      if (key === '/management') {
        this.$root.eventHub.$emit('showMX', 0)
      }
      if (key === '/order') {
        this.$root.eventHub.$emit('updateOrder')
      }
      if (key === '/score-record') {
        this.$root.eventHub.$emit('updateScoreRecord')
      }
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setScorerate: 'SET_SCORERATE',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  watch: {
    money(val, oldval) {
      if (val.length >= oldval.length + 6 || isNaN(val)) {
        this.money = ''
      }
    }
  },
  components: {
    sidebar,
    interlayer,
    popup
  },
  beforeDestroy() {
    this._clearTimeforSPS()
  }
}

</script>
<style type="text/css" scoped>
.input-defult:hover {
  animation: gradientIndex .5s ease 1 forwards;
}

@keyframes gradientIndex {
  0% {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }
  100% {
    border-bottom: 1px solid #ff9430;
  }
}

.iconfont {
  font-size: 20px;
  margin: 0 10px 0 0;
}

.header {
  height: auto;
  min-height: 65px;
  width: 100%;
  flex-wrap: wrap;
  background: #fff;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, .1);
  overflow: hidden;
}

.phone-nav {
  width: 50px;
  height: 65px;
  flex-shrink: 0;
}

.pc-nav {
  height: 65px;
  flex-grow: 1;
  min-width: 30%;
  max-width: 100%;
  flex-shrink: 0;
}

.logo {
  height: 65px;
  max-width: 100%;
  min-width: 240px;
  flex-shrink: 0;
  flex-grow: 1;
}

.disable:hover {
  pointer-events: none;
}











































/*start ---改写我的账户下拉窗 2018.04.27*/

.phone-item {
  color: #000 !important;
  font-size: 13px;
  height: 50px;
}

.phone-item:hover {
  color: #000 !important;
}

.agent-item {
  height: 70px !important;
  width: 100%;
  flex-wrap: wrap;
  /*border-bottom: 1px solid red;*/
  position: relative;
}

.agent-ul-warp {
  width: 86%;
  height: 55%;
  border-radius: 5px;
  background: #FFD236;
  color: #000;
  font-size: 14px;
  transform: translate(0, -15%);
}

.agent-border-bootom {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 1px;
  width: 100%;
  background: rgba(0, 0, 0, .1);
}

.agent-ul-li {
  box-sizing: content-box;
  min-width: 100%;
  height: 100%;
  font-size: 14px;
}

.agent-ul-li:hover {
  background: #FFD236 !important;
}

.agent-ul-li-left {
  width: 35%;
  height: 100%;
  justify-content: flex-start;
  padding-left: 5%;
  /*flex-grow: 1;*/
}

.agent-ul-li-right {
  width: 55%;
  height: 100%;
  justify-content: flex-end;
  padding-right: 5%;
}











































/*end ---改写我的账户下拉窗*/

.icon-jifen {
  color: #777 !important;
}

.iconfont {
  color: #000;
}

.log-out {
  display: inline-block;
  height: 100%;
  width: 100%;
  line-height: 60px;
  pointer-events: auto;
  cursor: pointer;
  zoom: 1;
  margin-top: -3px;
  font-size: 15px;
}

.log-out-min {
  line-height: 36px;
}

.green-text {
  display: inline-block;
  font-size: 15px;
  color: #4CAF50;
  margin: -5px 10px 0;
}

.recharge-box {
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
  position: relative;
}

.input-defult {
  width: 90%;
  height: 45px;
  margin: 10px auto;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.recharge-box-title {
  width: 90%;
  height: 70px;
  margin: 0 auto;
  font-size: 20px;
  font-weight: 600;
  color: #D94D37;
  border-bottom: 1px solid rgba(0, 0, 0, .2);
}

.recharge-box-title-agent {
  width: 100%;
  height: 70px;
  margin: 0 auto;
  font-size: 20px;
  font-weight: 600;
  color: #000;
  background: #FFD236;
}

.agreement-content {
  width: 82%;
  height: auto;
  min-height: 20px;
  max-height: 450px;
  margin: 20px auto 100px;
  font-size: 15px;
  line-height: 26px;
  font-weight: normal;
  overflow-y: scroll;
  overflow-x: hidden;
}

.content-qr {
  width: 100%;
  height: auto;
  flex-wrap: wrap;
}

.cq-right {
  /*  width: 60%;*/
  height: auto;
  flex-wrap: wrap;
}

.cq-left {
  width: 0;
  flex-grow: 1;
  height: 100%;
}

.net-item {
  width: 40%;
  height: 40px;
  background: #eee;
  color: #333;
  margin: 20px 5% 0;
  border: 1px solid rgba(0, 0, 0, .1);
}

.net-item:hover {
  cursor: pointer;
  /* color: #ff9430;*/
}

.recharge-btn-box {
  height: 70px;
  justify-content: flex-start;
}

.recharge-btn-box-after {
  width: 100%;
  height: 70px;
  margin-bottom: 10px;
}

.recharge-btn-sure {
  width: 35%;
  height: 46px;
  border-radius: 6px;
}

.recharge-btn-sure:nth-child(1) {
  margin: 0 20% 0 5%;
}

.recharge-btn-sure-after {
  width: 180px;
  height: 46px;
  border-radius: 6px;
  margin: 0 5%;
}

.recharge-btn-sure-after:nth-child(1) {
  /*margin: 0 10% 0 5%;*/
}

.min-tips-text {
  width: 100%;
  height: 20px;
  /*text-indent: 30px;*/
  padding-left: 5%;
  font-size: 13px;
  color: #999;
  justify-content: flex-start;
}

.course-btn {
  color: #42A5F5;
  text-indent: 0px;
}

.code-div {
  width: 100%;
  height: 40px;
}

.dialog-btn-box {
  width: 100%;
  height: auto;
  justify-content: center;
}

.showWX {
  background-color: #E8F8FF;
  border: 1px solid #D9F3FF;
  border-radius: 20px;
  color: #55C2F5;
  padding: 10px;
  height: 10px;
  min-width: 120px;
  margin: 10px 0 0;
}

.sureBtn {
  border: 1px solid #ff9430;
  border-radius: 20px;
  color: #ff9430;
  padding: 10px;
  height: 10px;
  min-width: 120px;
  margin: 0 15px 10px;
}

.colseBtn {
  border: 1px solid #999;
  border-radius: 20px;
  color: #999;
  padding: 10px;
  height: 10px;
  min-width: 120px;
  margin: 0 15px 10px;
}

.colseBtn:hover {
  background: #666;
  color: #fff;
  cursor: pointer;
}

.sureBtn:hover {
  background: #ff9430;
  color: #fff;
  cursor: pointer;
}

.qrcode-box {
  width: 190px;
  height: 190px;
  margin: 0 50%;
  flex-shrink: 0;
  height: auto;
}

.qrcode-box img {
  width: 100%;
  height: 100%;
}

.logo-class {
  width: 155px;
  height: 47px;
  /*  margin-left: -50px;*/
}

.logo-class:hover {
  cursor: pointer;
}

.pay-img {
  width: 144px;
  height: 44px;
  margin: 0 30px;
}

.my-money {
  color: #d94d37;
  text-indent: 0px;
}

.good-item {
  box-sizing: border-box;
  min-width: 75px;
  max-width: 28.33%;
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  flex-grow: 1;
  background: #FFE8D2;
  color: #D94D37;
  margin: 5px 5% 0 0;
  flex-wrap: wrap;
  align-content: center;
  border-radius: 8px;
}

.good-item-label {
  width: 100%;
  height: 40%;
}

.pay-item {
  box-sizing: border-box;
  max-width: 29.3%;
  width: 29.3%;
  min-width: 100px;
  height: 45px;
  flex-shrink: 0;
  flex-grow: 0;
  /*margin-left: 5%;*/
  margin-top: 5px;
  margin-right: 3%;
  color: #353535;
  font-size: 15px;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 8px;
}

.pay-icon {
  max-width: 30px;
  width: auto;
  max-height: 26px;
  height: auto;
  margin-right: 2%;
  flex-shrink: 1;
}

.goods-box {
  min-height: 50px;
  height: auto;
  width: 95%;
  padding-left: 5%;
  overflow: hidden;
  justify-content: flex-start;
  margin: 20px auto 5px;
  flex-wrap: wrap;
}

.active-good {
  /*color: red;*/
  color: #fff;
  background: #FF6B4E;
}

.cancel {
  box-sizing: border-box;
  color: #353535;
  background: rgba(223, 225, 229, 1);
}

.sure {
  box-sizing: border-box;
  color: #fff;
  background: #FF6B4E;
  /* box-shadow: 2px 0px 8px rgba(157, 106, 95, 1);*/
}

.sure-agent {
  box-sizing: border-box;
  color: #000;
  background: #FFD236;
}

.active-pay-type {
  border: 1px solid #FF6B4E;
  color: #FF6B4E;
}

.sure:hover {
  box-shadow: 2px 0px 8px rgba(157, 106, 95, 1);
}

.cancel:hover {
  box-shadow: 2px 0px 8px rgba(0, 0, 0, .3);
}

.disable-pay-type {
  color: rgba(0, 0, 0, .2);
  cursor: not-allowed;
}

.bottom {
  position: absolute;
  bottom: 0;
}

.agreement-content-title {
  width: 100%;
  height: 40px;
  font-size: 18px;
  color: #000;
  justify-content: flex-start;
}

.marginbottom20 {
  margin-bottom: 30px;
}

.agree-input-box {
  margin: 0 auto 20px;
  /*margin-bottom: 30px;*/
  width: 100%;
  height: 50px;
  overflow: hidden;
}

.agree-label {
  width: auto;
  height: 100%;
  min-width: 130px;
  color: #666;
  font-size: 15px;
  margin: 0 10px;
  /* justify-content: flex-start;*/
}

.input-defult {
  width: auto !important;
  flex-grow: 1;
}

.overHiden {
  overflow: hidden;
}

.must {
  font-weight: 600;
  font-size: 13px;
  color: red;
}

.not-must {
  font-size: 12px;
  color: #999;
}

.width90 {
  width: 90% !important;
}

.dialog-min-text {
  width: 100%;
  height: auto;
  line-height: 20px;
  min-height: 20px;
  font-size: 15px;
  color: #999;
}

.dialog-min-btn {
  width: 40%;
  min-width: 120px;
  padding: 2% 0;
  border-radius: 5px;
  background: #FFD236;
  color: #000;
  font-size: 15px;
  margin: 5% 10px 0;
}

.proxy-icon {
  max-width: 20px;
  height: auto;
  margin: 0 5px;
}

.font-weight-agent {
  font-weight: 600;
}

.agreement-content {
  /*border-bottom: 1px solid rgba(0,0,0,.1);
  */
  /*  box-shadow: 0 2px 1px rgba(0,0,0,.1);*/
}

.rbta-input-warp {
  width: 80%;
  height: 50px;
  border-radius: 10px;
  background: #f4f4f4;
  color: #353535;
  border: 1px solid #eee;
  font-size: 16px;
  margin: 50px auto 10px;
}

.rbata-iw-right {
  width: 30%;
  height: 100%;
}

.rbata-iw-left {
  width: 30%;
  height: 80%;
  outline: none;
  border: none;
  margin: 0 5%;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
}

.titps-domain {
  color: #FF9100;
}

.bdd-item {
  height: 50px;
  width: 100%;
  margin: 10px auto -10px;
}

.bdd-item-left {
  width: 16%;
  justify-content: flex-end;
  padding: 0 2%;
  font-size: 17px;
  color: #FF6B4E;
}

.bdd-item-right {
  width: 72%;
  justify-content: flex-start;
  margin: 0 7% 0 1%;
  color: #353535;
  font-size: 14px;
}

.bdd-item-right-url:hover {
  color: #FF6B4E;
}

.rbta-btn {
  background: #FFD236;
  border-radius: 10px;
  height: 80%;
  width: 25%;
  margin: 0 auto;
}

.sucess-domain {
  color: #67c23a;
}

.fail-domain {
  color: #e6a23c;
}

.cq-pay-img {
  width: 75%;
  max-width: 190px;
  height: auto;
}

.pay-iframe {
  visibility: hidden;
  opacity: 0;
  width: 1px;
  height: 1px;
  border: none;
}

.dl-explain-img {
  width: 100%;
}

.dl-explain-warp {
  position: relative;
}

.dl-agencylevel {
  width: 50%;
  height: 5%;
  position: absolute;
  bottom: 3%;
  left: 57%;
  transform: translate(-50%, 0);
}

.dl-aglevel-item {
  width: 0;
  flex-grow: 1;
  font-size: 12px;
  color: #353535;
}

</style>

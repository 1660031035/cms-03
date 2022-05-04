function initStudent() {
  // 需求1: 渲染学生列表
  axios({
    url: '/student/list',
    method: 'get',
  }).then(({
    data: res
  }) => {
    //成功回调
    if (res.code == 0) {
      // console.log(res)
      document.querySelector('tbody').innerHTML = res.data.map(item => {
        return `
          <tr>
          <th scope="row">${item.id}</th>
          <td>${item.name}</td>
          <td>${item.age}</td>
          <td>${item.sex}</td>
          <td>${item.group}</td>
          <td>${item.phone}</td>
          <td>${item.salary}</td>
          <td>${item.truesalary}</td>
          <td>${item.province+item.city+item.county}</td>
          <td>
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
              data-bs-target="#updateModal">修改</button>
            <button type="button" class="delete btn btn-danger btn-sm" data-id="${item.id}">删除</button>
          </td>
        </tr>
      `
      }).join('')
    }
  })
}
initStudent()
// 需求2: 删除学生列表 采用事件委托
document.querySelector('tbody').addEventListener('click', function (e) {
  // console.log(e.target)
  if (!e.target.classList.contains('delete')) return
  if (!confirm('你确定要删除吗?')) return
  // console.log(11)
  let id = e.target.getAttribute('data-id')
  axios({
    url: '/student/delete',
    method: 'delete',
    params: {
      id: id
    }
  }).then(({
    data: res
  }) => {
    if (res.code == 0) {
      // console.log(res)
      toastr.success(res.message)
      initStudent()
    }
  })
})

// 需求3: 省市区三级联动
// 页面一加载 显示省
function setCity(id) {
  let select1 = document.querySelector(`#${id} [name="province"]`)
  let select2 = document.querySelector(`#${id} [name="city"]`)
  let select3 = document.querySelector(`#${id} [name="county"]`)
  axios({
    url: '/geo/province',
    method: 'get',
  }).then(({
    data: res
  }) => {
    // console.log(res)
    let arr = ['<option value="">--省--</option>']
    res.forEach(item => {
      arr.push(`<option value="${item}">${item}</option>`)
    })
    select1.innerHTML = arr.join('')
    // console.log(select1)
  })
  // 市
  select1.onchange = function () {
    axios({
      url: '/geo/city',
      method: 'get',
      params: {
        pname: select1.value
      }
    }).then(({
      data: res
    }) => {
      //成功回调
      let arr = ['<option value="">--市--</option>']
      res.forEach(item => {
        arr.push(`<option value="${item}">${item}</option>`)
      })
      select2.innerHTML = arr.join('')
    })
    // 区
    select2.onchange = function () {
      axios({
        url: '/geo/county',
        method: 'get',
        params: {
          pname: select1.value,
          cname: select2.value
        }
      }).then(({
        data: res
      }) => {
        //成功回调
        let arr = ['<option value="">--县--</option>']
        res.forEach(item => {
          arr.push(`<option value="${item}">${item}</option>`)
        })
        select3.innerHTML = arr.join('')
      })
    }
  }

}
setCity('addModal')
setCity('updateModal')

document.querySelector('.header [type="button"]').addEventListener('click', function () {
  console.log(11);
})
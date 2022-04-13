/* Selector */

// 스마트스토어
const smartstoreUpload = document.querySelector('.smartstore-upload');
const smartstoreUploadUl = document.querySelector('.smartstore-upload-list');
// 쿠팡Wing
const coupangWingUpload = document.querySelector('.coupangwing-upload')
const coupangWingUploadUl = document.querySelector('.coupangwing-upload-list');

// 우체국
const postOffceTranslationButton = document.querySelector('.post-office-table-translation-button');
const postOffceDownloadButton = document.querySelector('.post-office-table-download-button');
const postOfficeTableHead = document.querySelector('.post-office-table-head');
const postOfficeTableBody = document.querySelector('.post-office-table-body');

/* 데이터 */
const uploadData = {
  smartStore: [],
  coupangWing: []
}

// 엑셀 파일 데이터
const template = {
  head: [
    "받는 분",
    "우편번호",
    "주소(시도+시군구+도로명+건물번호)",
    "상세주소(동, 호수, 洞명칭, 아파트, 건물명 등)",
    "휴대전화(010-1234-5678)",
    "일반전화(02-1234-5678)",
    "중량(kg)<",
    "부피(cm)=가로+세로+높이",
    "내용품코드<",
    "내용물",
    "배송시요청사항",
    "분할접수 여부(Y/N)",
    "분할접수 첫번째 중량(kg)",
    "분할접수 첫번째 부피(cm)",
    "분할접수 두번째 중량(kg)",
    "분할접수 두번째 부피(cm)",
  ],
  body: []
}

// 엑셀 파일 읽고 데이터에 저장
const fileReader = (file, type) => {
  let reader = new FileReader();
  reader.onload = () => {
      let data = reader.result;
      let workBook = XLSX.read(data, { type: 'binary' });
      workBook.SheetNames.forEach((sheetName) => {
          console.log('SheetName: ' + sheetName);
          let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
          // console.log(rows);
          uploadData[type] = [...uploadData[type], ...rows];
          console.log(uploadData);
      })
  };
  reader.readAsBinaryString(file);
}

// 파일 업로드 핸들러
const handlerUpload = (event, type) => {
  let input = event.target;

  // 엑셀 파일 업로드 및 데이터 저장
  for(let i = 0; i < input.files.length; i++){
    fileReader(input.files[i], type);
  }

  setTimeout(()=> {
    // ur에 업로드한 데이터를 li로 출력
    let ul;
    switch(type){
      case "smartStore":
        ul = smartstoreUploadUl;
        for(let i = 1; i < uploadData[type].length; i++){
          const li = document.createElement('li');

          const spanName = document.createElement('span');
          const spanProduct = document.createElement('span');
          const spanCount = document.createElement('span');
          
          spanName.textContent = uploadData[type][i]['__EMPTY_9']; // 수취인명
          spanProduct.textContent = uploadData[type][i]['__EMPTY_36']; // 판매자 상품코드
          spanCount.textContent = uploadData[type][i]['__EMPTY_19']; // 수량
          
          li.append(spanName, " : " ,spanProduct, " ", spanCount, " 개");
          ul.appendChild(li);
        }
        break;
        case "coupangWing":
          ul = coupangWingUploadUl;
          for(let i = 0; i < uploadData[type].length; i++){
            const li = document.createElement('li');

          const spanName = document.createElement('span');
          const spanProduct = document.createElement('span');
          const spanCount = document.createElement('span');
          
          spanName.textContent = uploadData[type][i]['수취인이름'];
          spanProduct.textContent = uploadData[type][i]['등록상품명'];
          spanCount.textContent = uploadData[type][i]['구매수(수량)'];
          
          li.append(spanName, " : " ,spanProduct, " ", spanCount, " 개");
          ul.appendChild(li);
        }
        break;
    }
    console.log(ul)
  }, 1500);
}

const handlerOnClickPostOffceTranslation = () => {
  const smartStoreUploadData = uploadData.smartStore;
  const coupangWingUploadData = uploadData.coupangWing;
  template.body = [];

  for(let i = 1; i < smartStoreUploadData.length; i++ ){
    template.body.push({ 
      [template.head[0]]: smartStoreUploadData[i]['__EMPTY_9'],       // 받는 분
      [template.head[1]]: smartStoreUploadData[i]['__EMPTY_61'],      // 우편번호
      [template.head[2]]: smartStoreUploadData[i]['__EMPTY_62'],      // 주소(시도+시군구+도로명+건물번호)
      [template.head[3]]: smartStoreUploadData[i]['__EMPTY_63'],      // 상세주소(동, 호수, 洞명칭, 아파트, 건물명 등)
      [template.head[4]]: smartStoreUploadData[i]['__EMPTY_59'],      // 휴대전화(010-1234-5678)
      [template.head[5]]: smartStoreUploadData[i]['__EMPTY_60'] || '',// 일반전화(02-1234-5678)
      [template.head[6]]: "3",                                        // 중량(kg)
      [template.head[7]]: "80",                                       // 부피(cm)=가로+세로+높이
      [template.head[8]]: "농/수/축산물(일반)",                           // 내용품코드
      [template.head[9]]: "벌꿀",                                      // 내용물
      [template.head[10]]: smartStoreUploadData[i]['__EMPTY_44'],   // 배송시요청사항
      [template.head[11]]: "N",                                        // 분할접수 여부(Y/N)
      [template.head[12]]: "",                                        // 분할접수 첫번째 중량(kg)
      [template.head[13]]: "",                                        // 분할접수 첫번째 부피(cm)
      [template.head[14]]: "",                                        // 분할접수 두번째 중량(kg)
      [template.head[15]]: "",                                        // 분할접수 두번째 부피(cm)
    })
  }
  for(let i = 0; i < coupangWingUploadData.length; i++){
    template.body.push({ 
      [template.head[0]]: coupangWingUploadData[i]['수취인이름'],    // 받는 분
      [template.head[1]]: coupangWingUploadData[i]['우편번호'],     // 우편번호
      [template.head[2]]: coupangWingUploadData[i]['수취인 주소'],   // 주소(시도+시군구+도로명+건물번호)
      [template.head[3]]: "",                                     // 상세주소(동, 호수, 洞명칭, 아파트, 건물명 등)
      [template.head[4]]: coupangWingUploadData[i]['수취인전화번호'], // 휴대전화(010-1234-5678)
      [template.head[5]]: '',                                     // 일반전화(02-1234-5678)
      [template.head[6]]: "3",                                    // 중량(kg)
      [template.head[7]]: "80",                                   // 부피(cm)=가로+세로+높이
      [template.head[8]]: "농/수/축산물(일반)",                       // 내용품코드
      [template.head[9]]: "벌꿀",                                  // 내용물
      [template.head[10]]: coupangWingUploadData[i]['배송메세지'],   // 배송시요청사항
      [template.head[11]]: "N",                                    // 분할접수 여부(Y/N)
      [template.head[12]]: "",                                    // 분할접수 첫번째 중량(kg)
      [template.head[13]]: "",                                    // 분할접수 첫번째 부피(cm)
      [template.head[14]]: "",                                    // 분할접수 두번째 중량(kg)
      [template.head[15]]: "",                                    // 분할접수 두번째 부피(cm)
    })
  }

  // 변환 전 모든 자식 요소 제거
  while (postOfficeTableBody.firstChild) {
    postOfficeTableBody.removeChild(postOfficeTableBody.firstChild);
    }
    
  for(let bodyIndex = 0; bodyIndex < template.body.length; bodyIndex++){
    const tr = document.createElement('tr');
    for(let headIndex = 0; headIndex < template.head.length; headIndex++){
      const td = document.createElement('td');
      td.textContent = template.body[bodyIndex][template.head[headIndex]];
      tr.appendChild(td);
    }
    postOfficeTableBody.appendChild(tr);
  }
  
}

smartstoreUpload.addEventListener('change', (event) => handlerUpload(event, "smartStore"));
coupangWingUpload.addEventListener('change', (event) => handlerUpload(event, "coupangWing"));
postOffceTranslationButton.addEventListener('click', handlerOnClickPostOffceTranslation);
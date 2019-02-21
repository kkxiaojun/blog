# 排序算法js实现

要使用的工具函数
```javascript
function isArray(arr){
    if (typeof Array.isArray === 'function'){
        return Array.isArray(arr);
    } else{
        return Object.prototype.toString.call(arr) === '[object Array]'; 
    }
}
```
## 冒泡排序

**原理**

它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成

**步骤**

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。

2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。

3. 针对所有的元素重复以上的步骤，除了最后一个。

4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

**代码实现**
```javascript
// 对还未排序的全部数，自左向右对相邻的两个数进行对比，较大的数往下沉，较小的数往上冒泡
function bubbleSort(arr) {
    if (!isArray(arr) || !arr.length) {
        return;
    }
    let temp = null, len = arr.length;
    for (let i = 0; i < len - 1; i++) { // 每循环一次，就确定一个相对最大元素
        for (let j = 1; j < len -i; j++) { // 内层：有i个已经排好序，剩下：len - 1 -i 个需要排序 
            if (arr[j-1] > arr [j]) {
                temp = arr[j-1];
                arr[j-1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
// 改进：对于后面已经排好序的数进行记录，下一次不再进行比较
function bubbleSort2(arr) {
    if (!isArray(arr) || !arr.length) {
        return;
    }
    let temp = null, pos = arr.length, end = arr.length;
    for (let i = 0; i < arr.length; i++) {
        end = pos;
        for (let j = 1; j < end; j++) {
            if (arr[j-1] > arr [j]) {
                temp = arr[j-1];
                arr[j-1] = arr[j];
                arr[j] = temp;
                pos = j;
            }
        }
    }
    return arr;
}
// 改进：从左右两边，正反向分别冒泡
function bubbleSort3(arr) {
    var low = 0;
    var high = arr.length - 1; //设置变量的初始值
    var tmp, j;
    console.time('2.改进后冒泡排序耗时');
    while (low < high) {
        for (j = low; j < high; ++j) //正向冒泡,找到最大者
            if (arr[j] > arr[j + 1]) {
                tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
            --high; //修改high值, 前移一位
        for (j = high; j > low; --j) //反向冒泡,找到最小者
            if (arr[j] < arr[j - 1]) {
                tmp = arr[j];
                arr[j] = arr[j - 1];
                arr[j - 1] = tmp;
            }
            ++low; //修改low值,后移一位
    }
    return arr;
}
```
## 选择排序

**原理**

简单选择排序的基本思想非常简单，即：第一趟，从 n 个元素中找出关键字最小的元素与第一个元素交换；第二趟，在从第二个元素开始的 n-1 个元素中再选出关键字最小的元素与第二个元素交换；如此，第 k 趟，则从第 k 个元素开始的 n-k+1 个元素中选出关键字最小的元素与第 k 个元素交换，直到整个序列按关键字有序。

**步骤**

1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置

2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。

3. 重复第二步，直到所有元素均排序完毕。

**代码实现**
```javascript
function selectionSort(arr) {
    if (!isArray(arr) || !arr.length) {
        return;
    }
    let minItemIndex = 0, temp = null, len = arr.length;
    for (let i = 0; i < len; i++) {
        minItemIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[minItemIndex] > arr[j]) {
                minItemIndex = j;
            }
        }
        if (i !== minItemIndex) {
            temp = arr[minItemIndex];
            arr[minItemIndex] = arr[i];
            arr[i] = temp;
        }
    }
    return arr;
}
```
## 插入排序
**原理**

原理是通过构建youxuxulie，对于未排序的数据，在已排序序列中从后向前扫描，找到相应位置并插入

**步骤**

1. 将第一个待排序序列看作是一个有序序列，把第二个到最后一个看作是一个无序序列
2. 从头到尾依次扫描未排序序列，将扫描到的元素插入到适当的位置

**代码实现**

```javascript
      // 原理是通过构建youxuxulie，对于未排序的数据，在已排序序列中从后向前扫描，找到相应位置并插入
      function insertionSort(arr) {
        if (!isArray(arr) || !arr.length) {
          return;
        }
        let current = null, preItemIndex = null, len = arr.length;
        for (let i = 1; i< len; i++) {
          preItemIndex = i - 1;
          current = arr[i];
          while (preItemIndex >= 0 && current < arr[preItemIndex]) {
            arr[preItemIndex + 1] = arr[preItemIndex];
            preItemIndex--;
          }
          // 满足条件，交换
          if (current !== arr[preItemIndex+1]) {
            arr[preItemIndex + 1] = current;
          }
        }
        return arr;
      }
```

## 希尔排序

**原理**

希尔排序是基于插入排序的以下两点性质而提出的改进方法：

1. 插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率
2. 但是插入排序一般是低效的，因为插入排序每次只能将数据移动一位

希尔排序基本思想是：先将整个待排序序列分割成若干个子序列分别进行直接插入排序，待整个序列中"基本有序"时，再对全体记录进行直接插入排序。

**步骤**

1. 选择一个增量序列，t1、t2...tk
2. 按增量序列个数，进行k趟排序

**代码实现**

```javascript
function shellSort(arr) {
    var len = arr.length,
        temp,
        gap = 1;
    while(gap < len/3) {          //动态定义间隔序列
        gap =gap*3+1;
    }
    for (gap; gap > 0; gap = Math.floor(gap/3)) {
        for (var i = gap; i < len; i++) {
            temp = arr[i];
            for (var j = i-gap; j >= 0 && arr[j] > temp; j-=gap) {
                arr[j+gap] = arr[j];
            }
            arr[j+gap] = temp;
        }
    }
    return arr;
}
```



##  归并排序

**原理**

归并排序是另一类不同的排序方法，这种方法是运用分治法解决问题的典型范例。归并排序的基本思想是基于合并操作，即合并两个已经有序的序列是容易的，不论这两个序列是顺序存储还是链式存储，合并操作都可以Ο(m+n)时间内完成（假设两个有序表的长度分别为 m 和 n）。

**步骤**

为此，由分治法的一般设计步骤得到归并排序的过程为：

1. 划分：将待排序的序列划分为大小相等（或大致相等）的两个子序列；
2. 治理：当子序列的规模大于 1 时，递归排序子序列，如果子序列规模为 1 则成为有
  序序列；
3. 组合：将两个有序的子序列合并为一个有序序列。

**代码实现**

```javascript
function mergeSort(arr) {  // 采用自上而下的递归方法
    var len = arr.length;
    if(len < 2) {
        return arr;
    }
    var middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right)
{
    var result = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}
```



## 快速排序

**原理**

快速排序是将分治法运用到排序问题中的一个典型例子，快速排序的基本思想是：通过一个枢轴（pivot）元素将 n 个元素的序列分为左、右两个子序列 Ll 和 Lr，其中子序列 Ll中的元素均比枢轴元素小，而子序列 Lr 中的元素均比枢轴元素大，然后对左、右子序列分别进行快速排序，在将左、右子序列排好序后，则整个序列有序，而对左右子序列的排序过程直到子序列中只包含一个元素时结束，此时左、右子序列由于只包含一个元素则自然有序。

**步骤**

用分治法的三个步骤来描述快速排序的过程如下：
1. 划分步骤：通过枢轴元素 x 将序列一分为二， 且左子序列的元素均小于 x，右子
   序列的元素均大于 x；

2. 治理步骤：递归的对左、右子序列排序；

3. 组合步骤：无

**代码实现**

```javascript
// 输入：数据元素数组 arr，划分序列区间[low..high]
// 输出：将序列划分为两个子序列并返回枢轴元素的位置
function partition(arr, low, high) {
  let pivot = arr[low];
  while (low < high) {
    while (low < high && arr[high] >= pivot) {
      high--;
    }
    arr[low] = arr[high];
    while (low < high && arr[low] <= pivot) {
      low++;
    }
    arr[high] = arr[low];
  }
  arr[low] = pivot;
  return low;
}
function quickSort(arr, low, high) {
  if (low < high) {
    let pivot = partition(arr, low, high);
    quickSort(arr, low, pivot - 1);
    quickSort(arr, pivot + 1, high);
  }
  return arr;
}
```

##  堆排序
**原理**
堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。堆排序可以说是一种利用堆的概念来排序的选择排序。分为两种方法：

大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；
堆排序的平均时间复杂度为 Ο(nlogn)。

**步骤**


**代码实现**
```javascript

````

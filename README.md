# webGL-note
我已经学完有效的两章了，我学到了什么呢？来回忆一下吧。

1. 绘制的基本步骤
着色器程序是用GLSL ES语言写的，在js文件中以字符串的形式加载。  
着色器分为顶点着色器和片元着色器。

借助canvas创建webgl绘图上下文  
初始化着色器，即js加载着色器程序。  
定义背景颜色  
用背景色填充  
绘制  

2. 绘制一个点
js程序和着色器程序之间借助attribute和uniform变量来传输数据
3. 利用缓冲区绘制多个点
4. 绘制基本图形
点，线段，三角形
5. 图形的变换
平移旋转缩放，矩阵，公式推导比较有意思

矩阵运算的数学细节是我感兴趣的部分。
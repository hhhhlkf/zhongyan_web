const glsl = `
varying vec3 vNormal;
varying vec3 eyeVector;
uniform float atmOpacity;
uniform float atmPowFactor;
uniform float atmMultiplier;

void main() {
    // 从边缘开始到地球背部的中心，dotP会从0增加到1
    float dotP = dot( vNormal, eyeVector );
    // 该因子是为了创造真实的大气增厚的效果
    float factor = pow(dotP, atmPowFactor) * atmMultiplier;
    // 在颜色中添加一点 dotP，使其更白，同时颜色加深
    vec3 atmColor = vec3(0.35 + dotP/4.5, 0.35 + dotP/4.5, 1.0);
    // 使用 atmOpacity 控制大气颜色的整体强度
    gl_FragColor = vec4(atmColor, atmOpacity) * factor;
}
`
export default glsl


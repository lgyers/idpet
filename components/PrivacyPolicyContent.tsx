"use client";

import { motion } from "framer-motion";

export function PrivacyPolicyContent() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">隐私政策</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                            最后更新日期：2024年1月
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 概述</h2>
                            <p className="text-gray-600 mb-4">
                                PetPhoto AI（以下简称"我们"）重视您的隐私，并致力于保护您的个人信息。本隐私政策说明了我们如何收集、使用、披露和保护您的信息。
                            </p>
                            <p className="text-gray-600">
                                使用我们的服务即表示您同意本隐私政策的条款。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 我们收集的信息</h2>
                            <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 您提供的信息</h3>
                            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                                <li>账户信息：姓名、电子邮件地址、密码</li>
                                <li>支付信息：账单地址、支付卡信息（通过Stripe处理）</li>
                                <li>宠物照片：您上传的宠物图片</li>
                                <li>生成偏好：您选择的场景模板和风格选项</li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 自动收集的信息</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>设备信息：浏览器类型、操作系统、设备标识符</li>
                                <li>使用数据：访问时间、页面浏览、功能使用情况</li>
                                <li>日志信息：IP地址、错误报告、诊断数据</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 我们如何使用您的信息</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>提供和维护我们的服务</li>
                                <li>处理您的照片生成请求</li>
                                <li>管理您的账户和订阅</li>
                                <li>处理付款和防止欺诈</li>
                                <li>发送服务通知和更新</li>
                                <li>改进我们的AI模型和服务质量</li>
                                <li>遵守法律义务</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 信息共享</h2>
                            <p className="text-gray-600 mb-4">
                                我们不会出售您的个人信息。我们可能在以下情况下共享信息：
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>与第三方服务提供商（如Stripe支付处理）</li>
                                <li>遵守法律要求或保护我们的权利</li>
                                <li>获得您的明确同意</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 数据安全</h2>
                            <p className="text-gray-600 mb-4">
                                我们采用行业标准的安全措施保护您的信息，包括：
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>传输和存储加密</li>
                                <li>访问控制和身份验证</li>
                                <li>定期安全审计</li>
                            </ul>
                            <p className="text-gray-600 mt-4">
                                但请注意，没有任何互联网传输或电子存储方法是100%安全的。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 数据保留</h2>
                            <p className="text-gray-600 mb-4">
                                我们保留您的信息的时间为实现本政策所述目的所必需的时间，除非法律要求更长的保留期。
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>账户信息：直到账户删除</li>
                                <li>生成记录：30天（可手动删除）</li>
                                <li>支付信息：根据法律要求</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 您的权利</h2>
                            <p className="text-gray-600 mb-4">
                                根据适用法律，您可能拥有以下权利：
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>访问、更正或删除您的个人信息</li>
                                <li>导出您的数据</li>
                                <li>撤回同意</li>
                                <li>反对某些数据处理活动</li>
                            </ul>
                            <p className="text-gray-600 mt-4">
                                如需行使这些权利，请联系 privacy@petphoto.ai
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 儿童隐私</h2>
                            <p className="text-gray-600">
                                我们的服务不面向13岁以下的儿童。如果我们发现收集了儿童的信息，将立即删除。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 政策变更</h2>
                            <p className="text-gray-600">
                                我们可能不时更新本隐私政策。重大变更将通过服务通知或电子邮件告知您。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 联系我们</h2>
                            <p className="text-gray-600">
                                如有隐私相关问题，请联系：<br />
                                邮箱：privacy@petphoto.ai<br />
                                地址：[您的公司地址]
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

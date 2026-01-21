"use client";

import { motion } from "framer-motion";

export function TermsOfServiceContent() {
    return (
        <div className="min-h-screen bg-[image:var(--gradient-soft)]">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card p-8 md:p-12 dark:[&_.text-gray-900]:text-foreground dark:[&_.text-gray-600]:text-muted-foreground dark:[&_.text-gray-500]:text-muted-foreground"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">服务条款</h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                            最后更新日期：2024年1月
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 接受条款</h2>
                            <p className="text-gray-600 mb-4">
                                欢迎使用 PetPhoto AI（以下简称“服务”）。通过访问或使用我们的服务，您同意遵守本服务条款（以下简称“条款”）并具有法律约束力。
                            </p>
                            <p className="text-gray-600">
                                如果您不同意这些条款，请不要使用我们的服务。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 服务描述</h2>
                            <p className="text-gray-600 mb-4">
                                PetPhoto AI 提供基于人工智能的宠物照片生成服务，包括：
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>宠物照片上传和存储</li>
                                <li>AI驱动的照片风格转换</li>
                                <li>生成结果下载</li>
                                <li>订阅和支付服务</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 用户账户</h2>
                            <h3 className="text-xl font-medium text-gray-900 mb-3">3.1 注册</h3>
                            <p className="text-gray-600 mb-4">
                                您必须提供准确、完整和最新的注册信息。您有责任维护账户密码的保密性。
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">3.2 账户安全</h3>
                            <p className="text-gray-600 mb-4">
                                您同意立即通知我们任何未经授权使用您账户的情况。我们对因您未能保护账户信息而造成的损失不承担责任。
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">3.3 账户终止</h3>
                            <p className="text-gray-600">
                                我们保留在违反这些条款或滥用服务时暂停或终止您账户的权利。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 使用规则</h2>
                            <p className="text-gray-600 mb-4">
                                您同意不：
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>上传非法、侵权或有害内容</li>
                                <li>使用自动化工具访问服务</li>
                                <li>试图破解或绕过安全措施</li>
                                <li>干扰服务的正常运行</li>
                                <li>冒充他人或实体</li>
                                <li>收集其他用户的信息</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 知识产权</h2>
                            <h3 className="text-xl font-medium text-gray-900 mb-3">5.1 您的内容</h3>
                            <p className="text-gray-600 mb-4">
                                您保留对您上传的宠物照片的所有权。通过上传内容，您授予我们处理这些照片以提供服务的权利。
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">5.2 生成内容</h3>
                            <p className="text-gray-600 mb-4">
                                您拥有使用我们服务生成的照片的权利，可用于个人和商业用途。
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">5.3 服务内容</h3>
                            <p className="text-gray-600">
                                服务本身、我们的商标和所有相关技术是我们的专有财产。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 订阅和付款</h2>
                            <h3 className="text-xl font-medium text-gray-900 mb-3">6.1 订阅计划</h3>
                            <p className="text-gray-600 mb-4">
                                我们提供不同的订阅计划，具体功能和使用限制在定价页面说明。
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">6.2 付款</h3>
                            <p className="text-gray-600 mb-4">
                                订阅费用通过Stripe处理。您同意支付所有适用的费用。
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">6.3 退款</h3>
                            <p className="text-gray-600 mb-4">
                                我们提供30天退款保证。超过此期限，退款由我们自行决定。
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">6.4 取消</h3>
                            <p className="text-gray-600">
                                您可以随时取消订阅。取消将在当前计费周期结束时生效。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 隐私</h2>
                            <p className="text-gray-600 mb-4">
                                您的隐私对我们很重要。请查看我们的隐私政策，了解我们如何收集、使用和保护您的信息。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 免责声明</h2>
                            <p className="text-gray-600 mb-4">
                                服务按“现状”提供，不提供任何明示或暗示的保证。我们不保证：
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>服务将不间断、及时、安全或无错误</li>
                                <li>生成结果的质量满足您的期望</li>
                                <li>服务中的错误将被纠正</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 责任限制</h2>
                            <p className="text-gray-600 mb-4">
                                在法律允许的最大范围内，我们对任何间接、偶然、特殊或后果性损害不承担责任。
                            </p>
                            <p className="text-gray-600">
                                我们的总责任不超过您在索赔前12个月内支付的服务费用。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 赔偿</h2>
                            <p className="text-gray-600">
                                您同意赔偿并使我们免受因您使用服务或违反这些条款而产生的任何索赔、损害或费用。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. 条款变更</h2>
                            <p className="text-gray-600">
                                我们保留随时修改这些条款的权利。重大变更将通过服务通知或电子邮件告知您。继续使用服务即表示接受修改后的条款。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. 适用法律</h2>
                            <p className="text-gray-600">
                                这些条款受[您的司法管辖区]法律管辖。任何争议应提交[您的城市]的法院解决。
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. 联系我们</h2>
                            <p className="text-gray-600">
                                如有任何问题，请联系：<br />
                                邮箱：legal@petphoto.ai<br />
                                地址：[您的公司地址]
                            </p>
                        </section>

                        <section>
                            <p className="text-sm text-gray-500">
                                继续使用我们的服务即表示您已阅读、理解并同意这些服务条款。
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
